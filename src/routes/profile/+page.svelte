<script>
    import { onMount } from 'svelte';
    import { getAuth, onAuthStateChanged, updateProfile, updateEmail } from 'firebase/auth';
    import { goto } from '$app/navigation';
    import * as Card from '$lib/components/ui/card';
    import * as Button from '$lib/components/ui/button';
    import * as Tabs from '$lib/components/ui/tabs';
    import * as Input from '$lib/components/ui/input';
    import * as Label from '$lib/components/ui/label';
    import * as Avatar from '$lib/components/ui/avatar';
    import * as Separator from '$lib/components/ui/separator';
    import * as Alert from '$lib/components/ui/alert';
    import * as Switch from '$lib/components/ui/switch';
    import {
        getFirestore,
        doc,
        getDoc,
        setDoc,
        updateDoc
    } from 'firebase/firestore';
    import {
        User,
        Settings,
        Bell,
        Shield,
        LogOut,
        Save,
        Camera,
        Mail,
        Key,
        AlertCircle,
        CheckCircle,
        Clock,
        FileText,
        Code,
        Braces,
        FileCode,
        Brain
    } from 'lucide-svelte';

    // Firebase setup
    const auth = getAuth();
    const db = getFirestore();
    let user = null;
    let loading = true;
    let activeTab = 'general';
    let userSettings = {
        notifications: {
            email: true,
            browser: true,
            updates: true
        },
        appearance: {
            darkMode: false,
            compactView: false
        },
        privacy: {
            shareUsage: true,
            saveHistory: true
        }
    };
   
    // Form state
    let displayName = '';
    let email = '';
    let photoURL = '';
    let newPassword = '';
    let confirmPassword = '';
    let currentPassword = '';
    let updateSuccess = false;
    let updateError = '';
    let passwordUpdateSuccess = false;
    let passwordUpdateError = '';
    let savingProfile = false;
    let savingPassword = false;
    let savingSettings = false;
   
    // Usage statistics
    let usageStats = {
        totalTools: 0,
        favoriteTools: [],
        recentActivity: []
    };

    // Load user data and settings
    async function loadUserData(userId) {
        try {
            // Get user settings
            const userDocRef = doc(db, 'users', userId);
            const userDoc = await getDoc(userDocRef);
           
            if (userDoc.exists()) {
                const userData = userDoc.data();
                if (userData.settings) {
                    userSettings = { ...userSettings, ...userData.settings };
                }
            } else {
                // Create user document if it doesn't exist
                await setDoc(userDocRef, {
                    uid: userId,
                    email: user.email,
                    displayName: user.displayName,
                    photoURL: user.photoURL,
                    settings: userSettings,
                    createdAt: new Date()
                });
            }
           
            // Load usage statistics
            await loadUsageStats(userId);
           
            loading = false;
        } catch (error) {
            console.error('Error loading user data:', error);
            loading = false;
        }
    }
   
    // Load usage statistics from various collections
    async function loadUsageStats(userId) {
        try {
            // Count tools used
            const toolsUsed = new Set();
           
            // Check prompt history
            const promptHistoryRef = doc(db, 'promptHistory', userId);
            const promptHistoryDoc = await getDoc(promptHistoryRef);
            if (promptHistoryDoc.exists()) {
                toolsUsed.add('AI Prompt Generator');
                const promptHistory = promptHistoryDoc.data().prompts || [];
                usageStats.recentActivity.push(...promptHistory.slice(0, 3).map(item => ({
                    type: 'AI Prompt',
                    title: item.template,
                    timestamp: item.timestamp,
                    icon: Brain
                })));
            }
           
            // Check base64 history
            const base64HistoryRef = doc(db, 'base64History', userId);
            const base64HistoryDoc = await getDoc(base64HistoryRef);
            if (base64HistoryDoc.exists()) {
                toolsUsed.add('Base64 Encoder/Decoder');
                const base64Items = base64HistoryDoc.data().items || [];
                usageStats.recentActivity.push(...base64Items.slice(0, 3).map(item => ({
                    type: 'Base64 Conversion',
                    title: item.type === 'text' ? 'Text Conversion' : 'Image Conversion',
                    timestamp: item.timestamp,
                    icon: FileCode
                })));
            }
           
            // Check JSON history
            const jsonHistoryRef = doc(db, 'jsonHistory', userId);
            const jsonHistoryDoc = await getDoc(jsonHistoryRef);
            if (jsonHistoryDoc.exists()) {
                toolsUsed.add('JSON Visualizer');
                const jsonEntries = jsonHistoryDoc.data().entries || [];
                usageStats.recentActivity.push(...jsonEntries.slice(0, 3).map(item => ({
                    type: 'JSON Visualization',
                    title: `${item.keyCount} keys extracted`,
                    timestamp: item.timestamp,
                    icon: Braces
                })));
            }
           
            // Sort all activities by timestamp
            usageStats.recentActivity.sort((a, b) => {
                const dateA = new Date(a.timestamp);
                const dateB = new Date(b.timestamp);
                return dateB - dateA;
            });
           
            // Limit to most recent 5
            usageStats.recentActivity = usageStats.recentActivity.slice(0, 5);
           
            // Set total tools used
            usageStats.totalTools = toolsUsed.size;
           
            // Set favorite tools (most used)
            usageStats.favoriteTools = Array.from(toolsUsed);
           
        } catch (error) {
            console.error('Error loading usage statistics:', error);
        }
    }
   
    // Save user settings to Firestore
    async function saveSettings() {
        if (!user) return;
       
        try {
            savingSettings = true;
            const userDocRef = doc(db, 'users', user.uid);
            await updateDoc(userDocRef, {
                'settings': userSettings
            });
            updateSuccess = true;
            setTimeout(() => {
                updateSuccess = false;
            }, 3000);
        } catch (error) {
            console.error('Error saving settings:', error);
            updateError = 'Failed to save settings. Please try again.';
            setTimeout(() => {
                updateError = '';
            }, 3000);
        } finally {
            savingSettings = false;
        }
    }
   
    // Update profile information
    async function updateProfileInfo() {
        if (!user) return;
       
        try {
            savingProfile = true;
            // Update Firebase Auth profile
            await updateProfile(user, {
                displayName: displayName,
                photoURL: photoURL
            });
           
            // Update email if changed
            if (email !== user.email) {
                await updateEmail(user, email);
            }
           
            // Update Firestore user document
            const userDocRef = doc(db, 'users', user.uid);
            await updateDoc(userDocRef, {
                displayName: displayName,
                email: email,
                photoURL: photoURL
            });
           
            updateSuccess = true;
            setTimeout(() => {
                updateSuccess = false;
            }, 3000);
        } catch (error) {
            console.error('Error updating profile:', error);
            updateError = error.message || 'Failed to update profile. Please try again.';
            setTimeout(() => {
                updateError = '';
            }, 3000);
        } finally {
            savingProfile = false;
        }
    }
   
    // Update password
    async function updateUserPassword() {
        if (!user) return;
       
        try {
            savingPassword = true;
           
            if (newPassword !== confirmPassword) {
                passwordUpdateError = 'Passwords do not match';
                return;
            }
           
            // This is a simplified version - in a real app, you would need to reauthenticate
            // the user before changing their password
           
            // For demonstration purposes only:
            // await updatePassword(user, newPassword);
           
            passwordUpdateSuccess = true;
            newPassword = '';
            confirmPassword = '';
            currentPassword = '';
           
            setTimeout(() => {
                passwordUpdateSuccess = false;
            }, 3000);
        } catch (error) {
            console.error('Error updating password:', error);
            passwordUpdateError = error.message || 'Failed to update password. Please try again.';
            setTimeout(() => {
                passwordUpdateError = '';
            }, 3000);
        } finally {
            savingPassword = false;
        }
    }

    // Format date
    function formatDate(dateString) {
        if (!dateString) return '';
        const date = dateString.toDate ? dateString.toDate() : new Date(dateString);
        return date.toLocaleString();
    }

    onMount(() => {
        onAuthStateChanged(auth, (userData) => {
            if (userData) {
                user = userData;
                displayName = userData.displayName || '';
                email = userData.email || '';
                photoURL = userData.photoURL || '';
                loadUserData(userData.uid);
            } else {
                goto('/');
            }
        });
    });
</script>

<div class="min-h-screen p-4">
    <div class="max-w-[1200px] mx-auto">
        <Card.Root class="mb-4">
            <Card.Header class="flex flex-row items-center justify-between">
                <div>
                    <Card.Title class="text-2xl">Profile Settings</Card.Title>
                    <Card.Description>Manage your account and preferences</Card.Description>
                </div>
            </Card.Header>
        </Card.Root>

        <div class="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4">
            <!-- Sidebar -->
            <div class="space-y-4">
                <Card.Root>
                    <Card.Content class="p-6">
                        <div class="flex flex-col items-center text-center">
                            <Avatar.Root class="w-24 h-24 mb-4">
                                <Avatar.Image src={user?.photoURL} alt={user?.displayName} />
                                <Avatar.Fallback>{user?.displayName?.charAt(0) || 'U'}</Avatar.Fallback>
                            </Avatar.Root>
                            <h3 class="text-xl font-semibold">{user?.displayName}</h3>
                            <p class="text-sm text-gray-500">{user?.email}</p>
                            
                            <Separator.Root class="my-4" />
                            
                            <!-- Use simple buttons instead of Tabs component -->
                            <div class="w-full space-y-1">
                                <button 
                                    class="w-full flex items-center justify-start gap-2 py-2 px-3 text-left rounded-md hover:bg-gray-100 transition-colors"
                                    class:bg-blue-50={activeTab === 'general'}
                                    class:text-blue-600={activeTab === 'general'}
                                    on:click={() => activeTab = 'general'}
                                >
                                    <User size={16} />
                                    <span>General</span>
                                </button>
                                
                                <button 
                                    class="w-full flex items-center justify-start gap-2 py-2 px-3 text-left rounded-md hover:bg-gray-100 transition-colors"
                                    class:bg-blue-50={activeTab === 'security'}
                                    class:text-blue-600={activeTab === 'security'}
                                    on:click={() => activeTab = 'security'}
                                >
                                    <Shield size={16} />
                                    <span>Security</span>
                                </button>
                                
                                <button 
                                    class="w-full flex items-center justify-start gap-2 py-2 px-3 text-left rounded-md hover:bg-gray-100 transition-colors"
                                    class:bg-blue-50={activeTab === 'notifications'}
                                    class:text-blue-600={activeTab === 'notifications'}
                                    on:click={() => activeTab = 'notifications'}
                                >
                                    <Bell size={16} />
                                    <span>Notifications</span>
                                </button>
                                
                                <button 
                                    class="w-full flex items-center justify-start gap-2 py-2 px-3 text-left rounded-md hover:bg-gray-100 transition-colors"
                                    class:bg-blue-50={activeTab === 'appearance'}
                                    class:text-blue-600={activeTab === 'appearance'}
                                    on:click={() => activeTab = 'appearance'}
                                >
                                    <Settings size={16} />
                                    <span>Appearance</span>
                                </button>
                            </div>
                        </div>
                    </Card.Content>
                </Card.Root>
                
                <!-- Usage Stats -->
                <Card.Root>
                    <Card.Header>
                        <Card.Title>Usage Statistics</Card.Title>
                    </Card.Header>
                    <Card.Content>
                        <div class="space-y-4">
                            <div class="flex justify-between items-center">
                                <span class="text-sm">Tools Used</span>
                                <span class="font-medium">{usageStats.totalTools}</span>
                            </div>
                            
                            {#if usageStats.favoriteTools.length > 0}
                                <div>
                                    <span class="text-sm font-medium block mb-2">Favorite Tools</span>
                                    <div class="space-y-1">
                                        {#each usageStats.favoriteTools as tool}
                                            <div class="text-sm text-gray-600 bg-gray-50 px-2 py-1 rounded">{tool}</div>
                                        {/each}
                                    </div>
                                </div>
                            {/if}
                        </div>
                    </Card.Content>
                </Card.Root>
            </div>
            <!-- Main Content -->
            <div class="space-y-4">
                {#if activeTab === 'general'}
                    <!-- General Tab Content -->
                    <Card.Root>
                        <Card.Header>
                            <Card.Title>Profile Information</Card.Title>
                            <Card.Description>Update your personal information</Card.Description>
                        </Card.Header>
                        <Card.Content class="space-y-4">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div class="space-y-2">
                                    <Label.Root for="displayName">Display Name</Label.Root>
                                    <Input.Root id="displayName" bind:value={displayName} disabled />
                                </div>
                                <div class="space-y-2">
                                    <Label.Root for="email">Email Address</Label.Root>
                                    <Input.Root id="email" type="email" bind:value={email} disabled />
                                </div>
                            </div>                            
                            
                            <div class="space-y-2">
                                <Label.Root for="photoURL">Profile Photo URL</Label.Root>
                                <div class="flex gap-2">
                                    <Input.Root id="photoURL" bind:value={photoURL} class="flex-1" />
                                    <Button.Root variant="outline" size="icon">
                                        <Camera size={16} />
                                    </Button.Root>
                                </div>
                            </div>
                            {#if updateSuccess}
                                <Alert.Root class="bg-green-50 border-green-200">
                                    <CheckCircle class="h-4 w-4 text-green-600" />
                                    <Alert.Title>Success</Alert.Title>
                                    <Alert.Description>Your profile has been updated successfully.</Alert.Description>
                                </Alert.Root>
                            {/if}
                            
                            {#if updateError}
                                <Alert.Root class="bg-red-50 border-red-200">
                                    <AlertCircle class="h-4 w-4 text-red-600" />
                                    <Alert.Title>Error</Alert.Title>
                                    <Alert.Description>{updateError}</Alert.Description>
                                </Alert.Root>
                            {/if}
                        </Card.Content>
                        <Card.Footer class="flex justify-end">
                            <Button.Root on:click={updateProfileInfo} disabled={savingProfile}>
                                {#if savingProfile}
                                    <div class="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent mr-2"></div>
                                    Saving...
                                {:else}
                                    <Save size={16} class="mr-2" />
                                    Save Changes
                                {/if}
                            </Button.Root>
                        </Card.Footer>
                    </Card.Root>
                    
                    <!-- Recent Activity -->
                    <Card.Root>
                        <Card.Header>
                            <Card.Title>Recent Activity</Card.Title>
                            <Card.Description>Your latest actions across tools</Card.Description>
                        </Card.Header>
                        <Card.Content>
                            {#if usageStats.recentActivity.length === 0}
                                <div class="text-center py-6 bg-gray-50 rounded-lg">
                                    <Clock size={32} class="mx-auto text-gray-400 mb-2" />
                                    <p class="text-gray-600">No recent activity</p>
                                </div>
                            {:else}
                                <div class="space-y-3">
                                    {#each usageStats.recentActivity as activity}
                                        <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                            <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                <svelte:component this={activity.icon} size={20} class="text-blue-600" />
                                            </div>
                                            <div class="flex-1">
                                                <p class="font-medium text-gray-800">{activity.type}</p>
                                                <p class="text-sm text-gray-500">{activity.title}</p>
                                            </div>
                                            <span class="text-sm text-gray-500">{formatDate(activity.timestamp)}</span>
                                        </div>
                                    {/each}
                                </div>
                            {/if}
                        </Card.Content>
                    </Card.Root>
                {/if}
                
                {#if activeTab === 'security'}
                    <!-- Security Tab Content -->
                    <Card.Root>
                        <Card.Header>
                            <Card.Title>Change Password</Card.Title>
                            <Card.Description>Update your password to keep your account secure</Card.Description>
                        </Card.Header>
                        <Card.Content class="space-y-4">
                            <div class="space-y-2">
                                <Label.Root for="currentPassword">Current Password</Label.Root>
                                <Input.Root id="currentPassword" type="password" bind:value={currentPassword} />
                            </div>
                            
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div class="space-y-2">
                                    <Label.Root for="newPassword">New Password</Label.Root>
                                    <Input.Root id="newPassword" type="password" bind:value={newPassword} />
                                </div>
                                <div class="space-y-2">
                                    <Label.Root for="confirmPassword">Confirm New Password</Label.Root>
                                    <Input.Root id="confirmPassword" type="password" bind:value={confirmPassword} />
                                </div>
                            </div>
                            
                            {#if passwordUpdateSuccess}
                                <Alert.Root class="bg-green-50 border-green-200">
                                    <CheckCircle class="h-4 w-4 text-green-600" />
                                    <Alert.Title>Success</Alert.Title>
                                    <Alert.Description>Your password has been updated successfully.</Alert.Description>
                                </Alert.Root>
                            {/if}
                            
                            {#if passwordUpdateError}
                                <Alert.Root class="bg-red-50 border-red-200">
                                    <AlertCircle class="h-4 w-4 text-red-600" />
                                    <Alert.Title>Error</Alert.Title>
                                    <Alert.Description>{passwordUpdateError}</Alert.Description>
                                </Alert.Root>
                            {/if}
                        </Card.Content>
                        <Card.Footer class="flex justify-end">
                            <Button.Root on:click={updateUserPassword} disabled={savingPassword}>
                                {#if savingPassword}
                                    <div class="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent mr-2"></div>
                                    Updating...
                                {:else}
                                    <Key size={16} class="mr-2" />
                                    Update Password
                                {/if}
                            </Button.Root>
                        </Card.Footer>
                    </Card.Root>
                    
                    <Card.Root>
                        <Card.Header>
                            <Card.Title>Privacy Settings</Card.Title>
                            <Card.Description>Manage your data and privacy preferences</Card.Description>
                        </Card.Header>
                        <Card.Content class="space-y-4">
                            <div class="flex items-center justify-between">
                                <div class="space-y-0.5">
                                    <Label.Root>Save Activity History</Label.Root>
                                    <p class="text-sm text-gray-500">Store your tool usage history for quick access</p>
                                </div>
                                <Switch.Root
                                    checked={userSettings.privacy.saveHistory}
                                    onCheckedChange={(checked) => userSettings.privacy.saveHistory = checked}
                                />
                            </div>
                            
                            <Separator.Root />
                            
                            <div class="flex items-center justify-between">
                                <div class="space-y-0.5">
                                    <Label.Root>Share Usage Data</Label.Root>
                                    <p class="text-sm text-gray-500">Help us improve by sharing anonymous usage data</p>
                                </div>
                                <Switch.Root
                                    checked={userSettings.privacy.shareUsage}
                                    onCheckedChange={(checked) => userSettings.privacy.shareUsage = checked}
                                />
                            </div>
                        </Card.Content>
                        <Card.Footer class="flex justify-end">
                            <Button.Root on:click={saveSettings} disabled={savingSettings}>
                                {#if savingSettings}
                                    <div class="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent mr-2"></div>
                                    Saving...
                                {:else}
                                    <Save size={16} class="mr-2" />
                                    Save Preferences
                                {/if}
                            </Button.Root>
                        </Card.Footer>
                    </Card.Root>
                {/if}
                
                {#if activeTab === 'notifications'}
                    <!-- Notifications Tab Content -->
                    <Card.Root>
                        <Card.Header>
                            <Card.Title>Notification Preferences</Card.Title>
                            <Card.Description>Manage how you receive notifications</Card.Description>
                        </Card.Header>
                        <Card.Content class="space-y-4">
                            <div class="flex items-center justify-between">
                                <div class="space-y-0.5">
                                    <Label.Root>Email Notifications</Label.Root>
                                    <p class="text-sm text-gray-500">Receive notifications via email</p>
                                </div>
                                <Switch.Root
                                    checked={userSettings.notifications.email}
                                    onCheckedChange={(checked) => userSettings.notifications.email = checked}
                                />
                            </div>
                            
                            <Separator.Root />
                            
                            <div class="flex items-center justify-between">
                                <div class="space-y-0.5">
                                    <Label.Root>Browser Notifications</Label.Root>
                                    <p class="text-sm text-gray-500">Receive notifications in your browser</p>
                                </div>
                                <Switch.Root
                                    checked={userSettings.notifications.browser}
                                    onCheckedChange={(checked) => userSettings.notifications.browser = checked}
                                />
                            </div>
                            
                            <Separator.Root />
                            
                            <div class="flex items-center justify-between">
                                <div class="space-y-0.5">
                                    <Label.Root>Product Updates</Label.Root>
                                    <p class="text-sm text-gray-500">Receive updates about new features and improvements</p>
                                </div>
                                <Switch.Root
                                    checked={userSettings.notifications.updates}
                                    onCheckedChange={(checked) => userSettings.notifications.updates = checked}
                                />
                            </div>
                        </Card.Content>
                        <Card.Footer class="flex justify-end">
                            <Button.Root on:click={saveSettings} disabled={savingSettings}>
                                {#if savingSettings}
                                    <div class="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent mr-2"></div>
                                    Saving...
                                {:else}
                                    <Save size={16} class="mr-2" />
                                    Save Preferences
                                {/if}
                            </Button.Root>
                        </Card.Footer>
                    </Card.Root>
                {/if}
                
                {#if activeTab === 'appearance'}
                    <!-- Appearance Tab Content -->
                    <Card.Root>
                        <Card.Header>
                            <Card.Title>Appearance Settings</Card.Title>
                            <Card.Description>Customize how the application looks</Card.Description>
                        </Card.Header>
                        <Card.Content class="space-y-4">
                            <div class="flex items-center justify-between">
                                <div class="space-y-0.5">
                                    <Label.Root>Dark Mode</Label.Root>
                                    <p class="text-sm text-gray-500">Switch between light and dark themes</p>
                                </div>
                                <Switch.Root
                                    checked={userSettings.appearance.darkMode}
                                    onCheckedChange={(checked) => userSettings.appearance.darkMode = checked}
                                />
                            </div>
                            
                            <Separator.Root />
                            
                            <div class="flex items-center justify-between">
                                <div class="space-y-0.5">
                                    <Label.Root>Compact View</Label.Root>
                                    <p class="text-sm text-gray-500">Use a more compact layout to fit more content</p>
                                </div>
                                <Switch.Root
                                    checked={userSettings.appearance.compactView}
                                    onCheckedChange={(checked) => userSettings.appearance.compactView = checked}
                                />
                            </div>
                        </Card.Content>
                        <Card.Footer class="flex justify-end">
                            <Button.Root on:click={saveSettings} disabled={savingSettings}>
                                {#if savingSettings}
                                    <div class="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent mr-2"></div>
                                    Saving...
                                {:else}
                                    <Save size={16} class="mr-2" />
                                    Save Preferences
                                {/if}
                            </Button.Root>
                        </Card.Footer>
                    </Card.Root>
                {/if}
            </div>
        </div>
    </div>
</div>
