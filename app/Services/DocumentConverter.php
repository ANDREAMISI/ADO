<?php

namespace App\Services;

use Exception;
use Illuminate\Support\Facades\Log;
use Dompdf\Dompdf;
use Dompdf\Options;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Writer\Pdf;
use PhpOffice\PhpWord\IOFactory as WordIOFactory;
use PhpOffice\PhpWord\Settings;

class DocumentConverter
{
    protected $cachePath = 'converted';

    public function __construct()
    {
        // Setup PhpWord DomPDF renderer
        $vendorPath = base_path('vendor/dompdf/dompdf/src');
        if (!file_exists($vendorPath)) {
            $vendorPath = base_path('vendor/dompdf/dompdf');
        }
        
        Settings::setPdfRendererName(Settings::PDF_RENDERER_DOMPDF);
        Settings::setPdfRendererPath($vendorPath);
        
        Log::info('DocumentConverter initialized', [
            'dompdf_path' => $vendorPath,
            'exists' => file_exists($vendorPath)
        ]);
    }

    public function toPdf($filePath, $fileType)
    {   
        Log::info('Conversion started', ['type' => $fileType, 'path' => $filePath]);
        
        if (!file_exists($filePath)) {
            throw new Exception('Source file not found: ' . $filePath);
        }
        
        $fileType = strtolower($fileType);
        $outputPath = $this->getTempPath('pdf');
        
        try {
            switch ($fileType) {
                case 'docx':
                case 'doc':
                    $this->convertWordToPdf($filePath, $outputPath);
                    break;
                    
                case 'xlsx':
                case 'xls':
                    $this->convertExcelToPdf($filePath, $outputPath);
                    break;
                    
                case 'pptx':
                case 'ppt':
                    $this->convertPowerPointToPdf($filePath, $outputPath);
                    break;
                    
                default:
                    Log::info('No conversion needed', ['type' => $fileType]);
                    return $filePath;
            }
            
            if (file_exists($outputPath)) {
                Log::info('Conversion successful', ['output' => $outputPath]);
                return $outputPath;
            } else {
                throw new Exception('Output file not created');
            }
            
        } catch (Exception $e) {
            Log::error('Conversion failed', [
                'type' => $fileType,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            if (file_exists($outputPath)) unlink($outputPath);
            throw $e;
        }
    }

    protected function convertWordToPdf($inputPath, $outputPath)
    {
        $phpWord = WordIOFactory::load($inputPath);
        $pdfWriter = WordIOFactory::createWriter($phpWord, 'PDF');
        $pdfWriter->save($outputPath);
    }

    protected function convertExcelToPdf($inputPath, $outputPath)
    {
        $spreadsheet = IOFactory::load($inputPath);
        
        // Use Dompdf writer properly
        $options = new Options();
        $options->set('defaultFont', 'Arial');
        $options->setIsRemoteEnabled(true);
        
        $dompdf = new Dompdf($options);
        $writer = new Pdf\Dpdf($spreadsheet, $dompdf->getOptions());
        $writer->save($outputPath);
    }

    protected function convertPowerPointToPdf($inputPath, $outputPath)
    {
        // Try LibreOffice first
        if ($this->convertWithLibreOffice($inputPath, $outputPath, 'pdf')) {
            return;
        }
        
        // Fallback error
        throw new Exception('PPTX conversion requires LibreOffice or specialized library');
    }

    protected function convertWithLibreOffice($inputPath, $outputPath, $format)
    {
        $dir = dirname($outputPath);
        
        // Windows paths (soffice.exe)
        $sofficePaths = [
            'C:\\Program Files\\LibreOffice\\program\\soffice.exe',
            'C:\\Program Files (x86)\\LibreOffice\\program\\soffice.exe',
            '"C:/Program Files/LibreOffice/program/soffice.com"'
        ];
        
        foreach ($sofficePaths as $soffice) {
            $command = sprintf(
                '%s --headless --convert-to %s --outdir "%s" "%s"',
                $soffice,
                $format,
                $dir,
                $inputPath
            );
            
            exec($command . ' 2>&1', $output, $returnCode);
            
            if ($returnCode === 0 && file_exists($outputPath)) {
                Log::info('LibreOffice conversion successful', ['command' => $command]);
                return true;
            }
        }
        
        Log::warning('LibreOffice not found', ['paths_tested' => $sofficePaths]);
        return false;
    }

    protected function getTempPath($extension = 'pdf')
    {
        $filename = uniqid('conv_') . '_' . time() . '.' . $extension;
        $path = storage_path('app/' . $this->cachePath . '/' . $filename);
        
        $dir = dirname($path);
        if (!is_dir($dir)) {
            mkdir($dir, 0755, true);
        }
        
        return $path;
    }

    public function cleanOldFiles($hours = 24)
    {
        $path = storage_path('app/' . $this->cachePath);
        if (!is_dir($path)) return;
        
        $files = glob($path . '/*.pdf');
        $now = time();
        
        foreach ($files as $file) {
            if (is_file($file) && ($now - filemtime($file) > $hours * 3600)) {
                unlink($file);
            }
        }
        
        Log::info('Cleanup completed', ['path' => $path, 'files_remaining' => count(glob($path . '/*.pdf'))]);
    }
}
?>

