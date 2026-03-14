<?php
require __DIR__ . '/vendor/autoload.php';
$app = require __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

foreach (App\Models\Document::with('category')->get() as $doc) {
    echo $doc->id . ' | ' . $doc->title . ' | cat_id=' . $doc->category_id . ' | cat=' . ($doc->category?->name ?? 'NULL') . PHP_EOL;
}
