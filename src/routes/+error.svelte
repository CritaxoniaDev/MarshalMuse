<script>
    import { page } from '$app/stores';
    import { ArrowLeft, Home, Search, HelpCircle } from 'lucide-svelte';
    import { Button } from '$lib/components/ui/button';
    import * as Card from '$lib/components/ui/card';
    import { onMount } from 'svelte';
  
    // Animation variables
    let isLoaded = false;
    let searchQuery = '';
    
    // Suggested pages for navigation
    const suggestedPages = [
      { title: 'Home', href: '/', icon: Home },
      { title: 'Documentation', href: '/docs/getting-started', icon: HelpCircle },
      { title: 'Flowchart Creator', href: '/app/flowchart-creator', icon: Search }
    ];
  
    onMount(() => {
      // Trigger animations after component mounts
      setTimeout(() => {
        isLoaded = true;
      }, 100);
    });
  
    // Handle search submission
    function handleSearch(e) {
      e.preventDefault();
      if (searchQuery.trim()) {
        window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
      }
    }
  </script>
  
  <svelte:head>
    <title>Page Not Found | MarshalMuse</title>
  </svelte:head>
  
  <div class="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-white to-gray-50">
  
    <div class="max-w-3xl w-full relative z-10">
      <!-- 404 Error Display -->
      <div class="text-center mb-8">
        <div 
          class="text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500 mb-4 transform transition-all duration-1000"
          class:translate-y-0={isLoaded}
          class:opacity-100={isLoaded}
          class:translate-y-10={!isLoaded}
          class:opacity-0={!isLoaded}
        >
          404
        </div>
        
        <h1 
          class="text-4xl font-bold text-gray-800 mb-4 transform transition-all duration-1000 delay-200"
          class:translate-y-0={isLoaded}
          class:opacity-100={isLoaded}
          class:translate-y-10={!isLoaded}
          class:opacity-0={!isLoaded}
        >
          Page Not Found
        </h1>
        
        <p 
          class="text-lg text-gray-600 max-w-xl mx-auto transform transition-all duration-1000 delay-400"
          class:translate-y-0={isLoaded}
          class:opacity-100={isLoaded}
          class:translate-y-10={!isLoaded}
          class:opacity-0={!isLoaded}
        >
          The page you're looking for doesn't exist or has been moved. 
          Let's get you back on track.
        </p>
      </div>
      
      <!-- Search Box -->
      <div 
        class="mb-12 transform transition-all duration-1000 delay-600"
        class:translate-y-0={isLoaded}
        class:opacity-100={isLoaded}
        class:translate-y-10={!isLoaded}
        class:opacity-0={!isLoaded}
      >
        <Card.Root class="border-2 border-gray-200 shadow-lg overflow-hidden">
          <form on:submit={handleSearch} class="flex items-center">
            <div class="flex-1 px-4 py-3">
              <Search class="inline-block text-gray-400 mr-2" size={18} />
              <input 
                type="text" 
                bind:value={searchQuery}
                placeholder="Search for content..." 
                class="w-[calc(100%-30px)] border-none outline-none focus:ring-0 text-gray-700 placeholder-gray-400"
              />
            </div>
            <Button 
              type="submit" 
              variant="default" 
              class="m-1 bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              Search
            </Button>
          </form>
        </Card.Root>
      </div>
      
      <!-- Navigation Options -->
      <div 
        class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12 transform transition-all duration-1000 delay-800"
        class:translate-y-0={isLoaded}
        class:opacity-100={isLoaded}
        class:translate-y-10={!isLoaded}
        class:opacity-0={!isLoaded}
      >
        {#each suggestedPages as page}
          <a 
            href={page.href} 
            class="flex flex-col items-center p-6 bg-white rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all duration-300 group"
          >
            <div class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-3 group-hover:bg-blue-600 transition-colors">
              <svelte:component this={page.icon} size={24} class="text-blue-600 group-hover:text-white transition-colors" />
            </div>
            <span class="font-medium text-gray-800">{page.title}</span>
          </a>
        {/each}
      </div>
      
      <!-- Return Button -->
      <div 
        class="text-center transform transition-all duration-1000 delay-1000"
        class:translate-y-0={isLoaded}
        class:opacity-100={isLoaded}
        class:translate-y-10={!isLoaded}
        class:opacity-0={!isLoaded}
      >
        <Button 
          variant="outline" 
          class="gap-2 border-2 border-gray-300 hover:border-gray-800 transition-all duration-300 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)]"
          on:click={() => history.back()}
        >
          <ArrowLeft size={18} />
          Go Back
        </Button>
      </div>
    </div>
    
    <!-- Animated Glitch Effect -->
    <div class="absolute inset-0 pointer-events-none overflow-hidden">
      {#each Array(5) as _, i}
        <div 
          class="absolute bg-blue-500/5 transform -skew-x-12 transition-all duration-[1500ms]"
          style="
            height: {2 + Math.random() * 5}px; 
            width: 100%; 
            left: 0; 
            top: {Math.random() * 100}%; 
            animation: glitch-{i} {7 + Math.random() * 10}s infinite linear;
            animation-delay: {Math.random() * 5}s;
          "
        ></div>
      {/each}
    </div>
  </div>
  
  <style>
    @keyframes glitch-0 {
      0% { transform: translateX(-100%) skewX(-12deg); }
      100% { transform: translateX(100%) skewX(-12deg); }
    }
    
    @keyframes glitch-1 {
      0% { transform: translateX(100%) skewX(-12deg); }
      100% { transform: translateX(-100%) skewX(-12deg); }
    }
    
    @keyframes glitch-2 {
      0% { transform: translateX(-100%) skewX(-12deg); }
      100% { transform: translateX(100%) skewX(-12deg); }
    }
    
    @keyframes glitch-3 {
      0% { transform: translateX(100%) skewX(-12deg); }
      100% { transform: translateX(-100%) skewX(-12deg); }
    }
    
    @keyframes glitch-4 {
      0% { transform: translateX(-100%) skewX(-12deg); }
      100% { transform: translateX(100%) skewX(-12deg); }
    }
  </style>
  