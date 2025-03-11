<script>
    import { onMount } from 'svelte';
    import { getAuth, onAuthStateChanged } from 'firebase/auth';
    import { goto } from '$app/navigation';
    import { Settings, Users, FileText, BarChart, Bell, Search } from 'lucide-svelte';

    const auth = getAuth();
    let user = null;
    let activeTab = 'dashboard';

    onMount(() => {
        onAuthStateChanged(auth, (userData) => {
            if (userData) {
                user = userData;
            } else {
                goto('/');
            }
        });
    });
</script>

<div class="min-h-screen bg-gray-50">
    <div class="pt-16 flex">
        <!-- Sidebar -->
        <aside class="w-64 fixed h-full bg-white border-r border-gray-100 p-4">
            <nav class="space-y-1">
                <button
                    class="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors"
                    class:bg-blue-50={activeTab === 'dashboard'}
                    class:text-blue-600={activeTab === 'dashboard'}
                    on:click={() => activeTab = 'dashboard'}
                >
                    <BarChart size={18} /> Dashboard
                </button>
                <button
                    class="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                    on:click={() => activeTab = 'users'}
                >
                    <Users size={18} /> Users
                </button>
                <button
                    class="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                    on:click={() => activeTab = 'documents'}
                >
                    <FileText size={18} /> Documents
                </button>
                <button
                    class="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                    on:click={() => activeTab = 'settings'}
                >
                    <Settings size={18} /> Settings
                </button>
            </nav>
        </aside>

        <!-- Main Content -->
        <main class="ml-64 flex-1 p-8">
            <div class="max-w-7xl mx-auto">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <!-- Stats Cards -->
                    <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 class="text-lg font-semibold text-gray-800">Total Users</h3>
                        <p class="text-3xl font-bold text-blue-600 mt-2">1,234</p>
                        <span class="text-sm text-green-600">↑ 12% from last month</span>
                    </div>
                    
                    <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 class="text-lg font-semibold text-gray-800">Active Projects</h3>
                        <p class="text-3xl font-bold text-blue-600 mt-2">56</p>
                        <span class="text-sm text-green-600">↑ 8% from last month</span>
                    </div>
                    
                    <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 class="text-lg font-semibold text-gray-800">Total Revenue</h3>
                        <p class="text-3xl font-bold text-blue-600 mt-2">$12,345</p>
                        <span class="text-sm text-red-600">↓ 3% from last month</span>
                    </div>
                </div>

                <!-- Recent Activity -->
                <div class="mt-8 bg-white rounded-xl shadow-sm border border-gray-100">
                    <div class="p-6">
                        <h2 class="text-xl font-bold text-gray-800">Recent Activity</h2>
                        <div class="mt-4 space-y-4">
                            {#each Array(5) as _, i}
                                <div class="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                    <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                        <Users size={20} class="text-blue-600" />
                                    </div>
                                    <div>
                                        <p class="font-medium text-gray-800">New user registered</p>
                                        <p class="text-sm text-gray-500">2 hours ago</p>
                                    </div>
                                </div>
                            {/each}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
</div>
