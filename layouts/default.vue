<template>
    <div class="min-h-screen flex flex-col bg-white">
        <AppHeaderLayout />
        <main class="flex-1">
            <slot />
        </main>
        <AppFooterLayout />
    </div>
</template>
