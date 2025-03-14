<script>
    import { onMount } from 'svelte';
    import { getAuth, onAuthStateChanged } from 'firebase/auth';
    import { goto } from '$app/navigation';
    import * as Card from '$lib/components/ui/card';
    import * as Button from '$lib/components/ui/button';
    import * as Tabs from '$lib/components/ui/tabs';
    import * as Textarea from '$lib/components/ui/textarea';
    import * as Separator from '$lib/components/ui/separator';
    import * as Select from '$lib/components/ui/select';
    import * as Switch from '$lib/components/ui/switch';
    import * as Label from '$lib/components/ui/label';
    import {
        FileCode,
        Image as ImageIcon,
        Copy,
        Download,
        RotateCcw,
        Upload,
        ArrowRightLeft,
        Clipboard,
        Check,
        AlertCircle,
        Info
    } from 'lucide-svelte';
    
    const auth = getAuth();
    let user = null;
    let loading = true;
    let activeTab = 'text';
    
    // Text encoding/decoding
    let textInput = '';
    let textOutput = '';
    let textMode = 'encode'; // encode or decode
    let textError = '';
    let textCopied = false;
    
    // Image encoding/decoding
    let imageInput = null;
    let imageOutput = null;
    let imageMode = 'encode'; // encode or decode
    let imageError = '';
    let imageName = '';
    let imageType = '';
    let imagePreview = '';
    let imageCopied = false;
    let dragActive = false;
    
    // History
    let history = [];
    
    function processText() {
        textError = '';
        textCopied = false;
        
        try {
            if (textMode === 'encode') {
                textOutput = btoa(textInput);
                addToHistory('text', 'encode', textInput, textOutput);
            } else {
                // Decode
                textOutput = atob(textInput);
                addToHistory('text', 'decode', textInput, textOutput);
            }
        } catch (error) {
            textError = textMode === 'encode' 
                ? 'Error encoding text. Please check your input.' 
                : 'Error decoding Base64. Please ensure the input is valid Base64.';
            console.error('Text processing error:', error);
        }
    }
    
    function processImage() {
        imageError = '';
        imageCopied = false;
        
        if (imageMode === 'encode' && imageInput) {
            const reader = new FileReader();
            reader.onload = (e) => {
                imageOutput = e.target.result;
                imagePreview = e.target.result;
                addToHistory('image', 'encode', imageName, imageOutput);
            };
            reader.onerror = () => {
                imageError = 'Error reading the image file.';
            };
            reader.readAsDataURL(imageInput);
        } else if (imageMode === 'decode' && textInput) {
            try {
                // Validate if the input is a valid base64 image
                if (!textInput.startsWith('data:image')) {
                    // Try to add the data URL prefix if it's missing
                    if (/^[A-Za-z0-9+/=]+$/.test(textInput)) {
                        // Guess the image type (default to PNG)
                        textInput = `data:image/png;base64,${textInput}`;
                    } else {
                        throw new Error('Invalid Base64 image data');
                    }
                }
                
                imageOutput = textInput;
                imagePreview = textInput;
                addToHistory('image', 'decode', 'Decoded Image', imageOutput);
            } catch (error) {
                imageError = 'Error decoding Base64 image. Please ensure the input is valid Base64 image data.';
                console.error('Image processing error:', error);
            }
        } else {
            imageError = imageMode === 'encode' 
                ? 'Please select an image to encode.' 
                : 'Please enter Base64 data to decode.';
        }
    }
    
    function handleImageDrop(e) {
        e.preventDefault();
        dragActive = false;
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleImageSelect(e.dataTransfer.files[0]);
        }
    }
    
    function handleImageSelect(file) {
        if (file && file.type.startsWith('image/')) {
            imageInput = file;
            imageName = file.name;
            imageType = file.type;
            
            // Create a preview
            const reader = new FileReader();
            reader.onload = (e) => {
                imagePreview = e.target.result;
            };
            reader.readAsDataURL(file);
        } else {
            imageError = 'Please select a valid image file.';
        }
    }
    
    function handleFileInputChange(e) {
        if (e.target.files && e.target.files[0]) {
            handleImageSelect(e.target.files[0]);
        }
    }
    
    function downloadImage() {
        if (imageOutput) {
            const link = document.createElement('a');
            link.href = imageOutput;
            link.download = imageName || 'decoded-image.png';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
    
    function downloadText() {
        if (textOutput) {
            const blob = new Blob([textOutput], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = textMode === 'encode' ? 'encoded.txt' : 'decoded.txt';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }
    }
    
    function copyToClipboard(text, type) {
        navigator.clipboard.writeText(text).then(() => {
            if (type === 'text') {
                textCopied = true;
                setTimeout(() => { textCopied = false; }, 2000);
            } else {
                imageCopied = true;
                setTimeout(() => { imageCopied = false; }, 2000);
            }
        });
    }
    
    function swapTextMode() {
        textMode = textMode === 'encode' ? 'decode' : 'encode';
        // Optionally swap input/output
        const temp = textInput;
        textInput = textOutput;
        textOutput = temp;
        textError = '';
        textCopied = false;
    }
    
    function swapImageMode() {
        imageMode = imageMode === 'encode' ? 'decode' : 'encode';
        imageError = '';
        imageCopied = false;
        imageInput = null;
        imageOutput = null;
        imagePreview = '';
    }
    
    function resetText() {
        textInput = '';
        textOutput = '';
        textError = '';
        textCopied = false;
    }
    
    function resetImage() {
        imageInput = null;
        imageOutput = null;
        imagePreview = '';
        imageError = '';
        imageName = '';
        imageType = '';
        imageCopied = false;
    }
    
    function addToHistory(type, mode, input, output) {
        const historyItem = {
            id: Date.now(),
            type,
            mode,
            input: type === 'text' ? input : (input || 'Image file'),
            output: type === 'text' ? output : 'Base64 Image Data',
            timestamp: new Date().toISOString()
        };
        
        history = [historyItem, ...history.slice(0, 9)]; // Keep only the last 10 items
    }
    
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleString();
    }
    
    function loadHistoryItem(item) {
        if (item.type === 'text') {
            activeTab = 'text';
            textMode = item.mode;
            textInput = item.input;
            textOutput = item.output;
        } else {
            activeTab = 'image';
            imageMode = item.mode;
            if (item.mode === 'decode') {
                textInput = item.output;
                imagePreview = item.output;
                imageOutput = item.output;
            }
        }
    }
    
    function clearHistory() {
        history = [];
    }
    
    onMount(() => {
        onAuthStateChanged(auth, (userData) => {
            if (userData) {
                user = userData;
                loading = false;
            } else {
                goto('/');
            }
        });
    });
</script>

<div class="min-h-screen p-4">
    <div class="max-w-[1600px] mx-auto">
        <Card.Root class="mb-4">
            <Card.Header class="flex flex-row items-center justify-between">
                <div>
                    <Card.Title class="text-2xl">Base64 Encoder/Decoder</Card.Title>
                    <Card.Description>Convert between base64 and text/images easily</Card.Description>
                </div>
                <div class="flex gap-2">
                    <Button.Root variant="outline" class="gap-2" on:click={clearHistory} disabled={history.length === 0}>
                        <RotateCcw size={16} />
                        Clear History
                    </Button.Root>
                </div>
            </Card.Header>
        </Card.Root>

        <div class="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-4">
            <!-- Main Content -->
            <div class="space-y-4">
                <Tabs.Root value={activeTab} onValueChange={(value) => (activeTab = value)}>
                    <Tabs.List class="w-full">
                        <Tabs.Trigger value="text" class="flex-1">
                            <div class="flex items-center justify-center gap-2">
                                <FileCode size={16} />
                                Text
                            </div>
                        </Tabs.Trigger>
                        <Tabs.Trigger value="image" class="flex-1">
                            <div class="flex items-center justify-center gap-2">
                                <ImageIcon size={16} />
                                Image
                            </div>
                        </Tabs.Trigger>
                    </Tabs.List>

                    <!-- Text Tab -->
                    <Tabs.Content value="text" class="space-y-4 pt-4">
                        <Card.Root>
                            <Card.Header class="flex flex-row items-center justify-between">
                                <div>
                                    <Card.Title>
                                        {textMode === 'encode' ? 'Text to Base64' : 'Base64 to Text'}
                                    </Card.Title>
                                    <Card.Description>
                                        {textMode === 'encode' 
                                            ? 'Convert plain text to Base64 encoding' 
                                            : 'Decode Base64 back to plain text'}
                                    </Card.Description>
                                </div>
                                <div class="flex items-center gap-2">
                                    <Button.Root variant="outline" size="sm" class="gap-2" on:click={swapTextMode}>
                                        <ArrowRightLeft size={16} />
                                        Swap Mode
                                    </Button.Root>
                                </div>
                            </Card.Header>
                            <Card.Content class="space-y-4">
                                <div>
                                    <div class="flex justify-between mb-2">
                                        <Label.Root for="textInput" class="text-sm font-medium">
                                            {textMode === 'encode' ? 'Text Input' : 'Base64 Input'}
                                        </Label.Root>
                                        <Button.Root variant="ghost" size="sm" class="h-8 px-2" on:click={resetText}>
                                            <RotateCcw size={14} class="mr-1" />
                                            Clear
                                        </Button.Root>
                                    </div>
                                    <Textarea.Root 
                                        id="textInput"
                                        bind:value={textInput} 
                                        placeholder={textMode === 'encode' 
                                            ? 'Enter text to encode to Base64...' 
                                            : 'Enter Base64 to decode...'}
                                        class="min-h-[150px] font-mono"
                                    />
                                </div>
                                
                                <div class="flex justify-center">
                                    <Button.Root 
                                        class="gap-2 px-6 py-2" 
                                        on:click={processText}
                                        disabled={!textInput}
                                    >
                                        <FileCode size={18} />
                                        {textMode === 'encode' ? 'Encode to Base64' : 'Decode from Base64'}
                                    </Button.Root>
                                </div>
                                
                                {#if textError}
                                    <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-start gap-2">
                                        <AlertCircle size={18} class="mt-0.5" />
                                        <p>{textError}</p>
                                    </div>
                                {/if}
                                
                                {#if textOutput}
                                    <div>
                                        <div class="flex justify-between mb-2">
                                            <Label.Root for="textOutput" class="text-sm font-medium">
                                                {textMode === 'encode' ? 'Base64 Output' : 'Decoded Text'}
                                            </Label.Root>
                                            <div class="flex gap-2">
                                                <Button.Root 
                                                    variant="outline" 
                                                    size="sm" 
                                                    class="h-8 px-2" 
                                                    on:click={() => copyToClipboard(textOutput, 'text')}
                                                >
                                                    {#if textCopied}
                                                        <Check size={14} class="mr-1" />
                                                        Copied!
                                                    {:else}
                                                        <Copy size={14} class="mr-1" />
                                                        Copy
                                                    {/if}
                                                </Button.Root>
                                                <Button.Root 
                                                    variant="outline" 
                                                    size="sm" 
                                                    class="h-8 px-2" 
                                                    on:click={downloadText}
                                                >
                                                    <Download size={14} class="mr-1" />
                                                    Download
                                                </Button.Root>
                                            </div>
                                        </div>
                                        <Textarea.Root 
                                        id="textOutput"
                                        value={textOutput} 
                                        readonly
                                        class="min-h-[150px] font-mono"
                                    />
                                </div>
                            {/if}
                        </Card.Content>
                    </Card.Root>
                </Tabs.Content>

                <!-- Image Tab -->
                <Tabs.Content value="image" class="space-y-4 pt-4">
                    <Card.Root>
                        <Card.Header class="flex flex-row items-center justify-between">
                            <div>
                                <Card.Title>
                                    {imageMode === 'encode' ? 'Image to Base64' : 'Base64 to Image'}
                                </Card.Title>
                                <Card.Description>
                                    {imageMode === 'encode' 
                                        ? 'Convert image files to Base64 data URLs' 
                                        : 'Convert Base64 data back to viewable images'}
                                </Card.Description>
                            </div>
                            <div class="flex items-center gap-2">
                                <Button.Root variant="outline" size="sm" class="gap-2" on:click={swapImageMode}>
                                    <ArrowRightLeft size={16} />
                                    Swap Mode
                                </Button.Root>
                            </div>
                        </Card.Header>
                        <Card.Content class="space-y-4">
                            {#if imageMode === 'encode'}
                                <!-- Image Upload Area -->
                                <div 
                                    class="border-2 border-dashed rounded-lg p-6 text-center transition-colors"
                                    class:border-blue-400={dragActive}
                                    class:bg-blue-50={dragActive}
                                    on:dragenter={(e) => { e.preventDefault(); dragActive = true; }}
                                    on:dragover={(e) => { e.preventDefault(); dragActive = true; }}
                                    on:dragleave={() => { dragActive = false; }}
                                    on:drop={handleImageDrop}
                                >
                                    {#if imagePreview}
                                        <div class="mb-4 relative max-w-md mx-auto">
                                            <img 
                                                src={imagePreview} 
                                                alt="Preview" 
                                                class="max-h-[300px] mx-auto rounded-md shadow-sm"
                                            />
                                            <div class="mt-2 text-sm text-gray-600">
                                                {imageName || 'Uploaded image'}
                                            </div>
                                            <Button.Root 
                                                variant="outline" 
                                                size="sm" 
                                                class="mt-2" 
                                                on:click={resetImage}
                                            >
                                                <RotateCcw size={14} class="mr-1" />
                                                Clear Image
                                            </Button.Root>
                                        </div>
                                    {:else}
                                        <div class="py-8">
                                            <Upload size={40} class="mx-auto text-gray-400 mb-4" />
                                            <p class="text-lg font-medium text-gray-700 mb-1">Drop your image here</p>
                                            <p class="text-sm text-gray-500 mb-4">or click to browse files</p>
                                            <Button.Root variant="outline" class="relative">
                                                <input 
                                                    type="file" 
                                                    accept="image/*" 
                                                    class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                                                    on:change={handleFileInputChange}
                                                />
                                                Select Image
                                            </Button.Root>
                                        </div>
                                    {/if}
                                </div>
                            {:else}
                                <!-- Base64 Input for Image Decoding -->
                                <div>
                                    <div class="flex justify-between mb-2">
                                        <Label.Root for="imageTextInput" class="text-sm font-medium">
                                            Base64 Image Data
                                        </Label.Root>
                                        <Button.Root variant="ghost" size="sm" class="h-8 px-2" on:click={resetImage}>
                                            <RotateCcw size={14} class="mr-1" />
                                            Clear
                                        </Button.Root>
                                    </div>
                                    <Textarea.Root 
                                        id="imageTextInput"
                                        bind:value={textInput} 
                                        placeholder="Paste Base64 image data here (with or without data:image prefix)..."
                                        class="min-h-[150px] font-mono"
                                    />
                                </div>
                            {/if}
                            
                            {#if imageError}
                                <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-start gap-2">
                                    <AlertCircle size={18} class="mt-0.5" />
                                    <p>{imageError}</p>
                                </div>
                            {/if}
                            
                            <div class="flex justify-center">
                                <Button.Root 
                                    class="gap-2 px-6 py-2" 
                                    on:click={processImage}
                                    disabled={imageMode === 'encode' ? !imageInput : !textInput}
                                >
                                    <ImageIcon size={18} />
                                    {imageMode === 'encode' ? 'Convert to Base64' : 'Convert to Image'}
                                </Button.Root>
                            </div>
                            
                            {#if imageOutput && imageMode === 'encode'}
                                <div>
                                    <div class="flex justify-between mb-2">
                                        <Label.Root for="imageOutput" class="text-sm font-medium">
                                            Base64 Image Data
                                        </Label.Root>
                                        <div class="flex gap-2">
                                            <Button.Root 
                                                variant="outline" 
                                                size="sm" 
                                                class="h-8 px-2" 
                                                on:click={() => copyToClipboard(imageOutput, 'image')}
                                            >
                                                {#if imageCopied}
                                                    <Check size={14} class="mr-1" />
                                                    Copied!
                                                {:else}
                                                    <Copy size={14} class="mr-1" />
                                                    Copy
                                                {/if}
                                            </Button.Root>
                                        </div>
                                    </div>
                                    <Textarea.Root 
                                        id="imageOutput"
                                        value={imageOutput} 
                                        readonly
                                        class="min-h-[150px] font-mono text-xs"
                                    />
                                </div>
                            {/if}
                            
                            {#if imageOutput && imageMode === 'decode'}
                                <div class="border rounded-lg p-4">
                                    <div class="flex justify-between mb-2">
                                        <h3 class="text-sm font-medium">Decoded Image</h3>
                                        <Button.Root 
                                            variant="outline" 
                                            size="sm" 
                                            class="h-8 px-2" 
                                            on:click={downloadImage}
                                        >
                                            <Download size={14} class="mr-1" />
                                            Download
                                        </Button.Root>
                                    </div>
                                    <div class="flex justify-center p-4 bg-gray-50 rounded-md">
                                        <img 
                                            src={imageOutput} 
                                            alt="Decoded" 
                                            class="max-h-[300px] rounded-md shadow-sm"
                                        />
                                    </div>
                                </div>
                            {/if}
                        </Card.Content>
                    </Card.Root>
                </Tabs.Content>
            </Tabs.Root>
        </div>

        <!-- Sidebar -->
        <div class="space-y-4">
            <!-- History -->
            <Card.Root>
                <Card.Header>
                    <Card.Title>Conversion History</Card.Title>
                    <Card.Description>Your recent Base64 conversions</Card.Description>
                </Card.Header>
                <Card.Content>
                    {#if history.length === 0}
                        <div class="text-center py-8 bg-gray-50 rounded-lg">
                            <Clipboard size={32} class="mx-auto text-gray-400 mb-2" />
                            <p class="text-gray-600">No conversion history yet</p>
                        </div>
                    {:else}
                        <div class="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                            {#each history as item}
                                <div 
                                    class="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                                    on:click={() => loadHistoryItem(item)}
                                >
                                    <div class="flex items-center justify-between mb-1">
                                        <div class="flex items-center gap-2">
                                            {#if item.type === 'text'}
                                                <FileCode size={16} class="text-blue-500" />
                                            {:else}
                                                <ImageIcon size={16} class="text-green-500" />
                                            {/if}
                                            <span class="font-medium text-sm">
                                                {item.type === 'text' ? 'Text' : 'Image'} 
                                                {item.mode === 'encode' ? 'Encoding' : 'Decoding'}
                                            </span>
                                        </div>
                                        <span class="text-xs text-gray-500">{formatDate(item.timestamp)}</span>
                                    </div>
                                    <div class="text-xs text-gray-600 truncate">
                                        {item.type === 'text' 
                                            ? (item.input.length > 40 ? item.input.substring(0, 40) + '...' : item.input)
                                            : item.input
                                        }
                                    </div>
                                </div>
                            {/each}
                        </div>
                    {/if}
                </Card.Content>
            </Card.Root>

            <!-- Tips Card -->
            <Card.Root>
                <Card.Header>
                    <Card.Title>Tips & Information</Card.Title>
                </Card.Header>
                <Card.Content>
                    <div class="space-y-4">
                        <div class="flex gap-3">
                            <div class="bg-blue-100 text-blue-600 p-2 rounded-full h-fit">
                                <Info size={16} />
                            </div>
                            <div>
                                <h4 class="font-medium text-sm">What is Base64?</h4>
                                <p class="text-sm text-gray-600">
                                    Base64 is a binary-to-text encoding scheme used to represent binary data in ASCII format.
                                </p>
                            </div>
                        </div>
                        <div class="flex gap-3">
                            <div class="bg-green-100 text-green-600 p-2 rounded-full h-fit">
                                <ImageIcon size={16} />
                            </div>
                            <div>
                                <h4 class="font-medium text-sm">Image Encoding</h4>
                                <p class="text-sm text-gray-600">
                                    Base64 encoded images can be used directly in HTML, CSS, and data URIs.
                                </p>
                            </div>
                        </div>
                        <div class="flex gap-3">
                            <div class="bg-purple-100 text-purple-600 p-2 rounded-full h-fit">
                                <AlertCircle size={16} />
                            </div>
                            <div>
                                <h4 class="font-medium text-sm">Size Considerations</h4>
                                <p class="text-sm text-gray-600">
                                    Base64 encoding increases file size by approximately 33% compared to the original binary.
                                </p>
                            </div>
                        </div>
                    </div>
                </Card.Content>
            </Card.Root>
        </div>
    </div>
</div>
</div>

<style>
/* Custom scrollbar for history */
:global(.max-h-\[500px\]::-webkit-scrollbar) {
    width: 8px;
}

:global(.max-h-\[500px\]::-webkit-scrollbar-track) {
    background: #f1f1f1;
    border-radius: 10px;
}

:global(.max-h-\[500px\]::-webkit-scrollbar-thumb) {
    background: #d1d5db;
    border-radius: 10px;
}

:global(.max-h-\[500px\]::-webkit-scrollbar-thumb:hover) {
    background: #9ca3af;
}
</style>

