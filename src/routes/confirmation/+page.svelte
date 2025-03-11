<script>
    import { onMount } from 'svelte';
    import { getAuth, onAuthStateChanged } from 'firebase/auth';
    import { getFirestore, doc, getDoc } from 'firebase/firestore';
    import { goto } from '$app/navigation';

    const auth = getAuth();
    const db = getFirestore();
    let userData = null;

    onMount(async () => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                userData = userDoc.data();
            } else {
                goto('/login');
            }
        });
    });
</script>

<div class="pt-20 flex items-center justify-center min-h-screen bg-gray-50">
    <div class="max-w-md w-full p-8 bg-white rounded-2xl shadow-[0_20px_50px_rgba(8,_112,_184,_0.1)] space-y-8">
        <div class="text-center space-y-2">
            <h2 class="text-4xl font-extrabold tracking-tight text-gray-900">Welcome!</h2>
            <p class="text-sm text-gray-600">Your account has been created successfully</p>
        </div>

        {#if userData}
            <div class="space-y-6">
                <div class="p-6 bg-gray-50 rounded-xl space-y-4">
                    <div class="flex items-center justify-center">
                        <div class="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                            <span class="text-2xl font-bold text-blue-600">{userData.fullName[0]}</span>
                        </div>
                    </div>
                    
                    <div class="space-y-3">
                        <div class="space-y-1">
                            <p class="text-sm text-gray-500">Full Name</p>
                            <p class="font-medium">{userData.fullName}</p>
                        </div>
                        <div class="space-y-1">
                            <p class="text-sm text-gray-500">Email</p>
                            <p class="font-medium">{userData.email}</p>
                        </div>
                        <div class="space-y-1">
                            <p class="text-sm text-gray-500">Account Created</p>
                            <p class="font-medium">{new Date(userData.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>

                <button
                    class="w-full py-4 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transform hover:translate-y-[-2px] transition-all duration-200 hover:shadow-lg"
                    on:click={() => goto('/dashboard')}
                >
                    Continue to Dashboard
                </button>
            </div>
        {/if}
    </div>
</div>
