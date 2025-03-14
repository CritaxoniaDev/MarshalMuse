<script>
    import { Router, Route, Link } from "svelte-routing";
    import '../app.css';
    import '@fontsource-variable/public-sans';
    import Header from './header.svelte';
    import { initializeApp } from 'firebase/app';
    import { SvelteToast } from '@zerodevx/svelte-toast'
    
    const firebaseConfig = {
        apiKey: 'AIzaSyBt9XLOdRcGAx50Bj5Aija7CI1h_RAG9YU',
        authDomain: 'marshalmuse.firebaseapp.com',
        projectId: 'marshalmuse',
        storageBucket: 'marshalmuse.firebasestorage.app',
        messagingSenderId: '834541278534',
        appId: '1:834541278534:web:c75589edf2c6803c680147',
        measurementId: 'G-588YTT2CKP'
    };

    initializeApp(firebaseConfig);
    let { children } = $props();
</script>

<Header />
<SvelteToast />
{@render children()}