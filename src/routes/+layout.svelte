<script>
    import '../app.css';
    import Header from './header.svelte';
    import { initializeApp } from 'firebase/app';
    
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
{@render children()}