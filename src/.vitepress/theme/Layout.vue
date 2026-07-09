<script setup>
import DefaultTheme from 'vitepress/theme'
const { Layout } = DefaultTheme
</script>

<template>
  <Layout>
    <template #layout-bottom>
      <footer class="vp-footer">
        <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener">cc-by-4.0</a>
        <span aria-hidden="true"> | </span>
        <a href="https://github.com/zercle" target="_blank" rel="noopener">Zercle Technology</a>
      </footer>
    </template>
  </Layout>
</template>

<style scoped>
.vp-footer {
  border-top: 1px solid var(--vp-c-divider);
  padding: 24px;
  text-align: center;
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
}
.vp-footer a { color: var(--vp-c-brand-1); text-decoration: none; }
.vp-footer a:hover { text-decoration: underline; }
</style>