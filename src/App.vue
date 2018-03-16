<template>
  <div id="app">
    <header class="doc-header">
      <doc-header class="doc-header-container" :config="config.header" active="移动端" />
    </header>
    <section class="doc-body">
      <div class="doc-menus">
        <side-menu :menus="config.routes || []" />
      </div>
      <router-view class="doc-content" />
    </section>
     <doc-footer :config="config.footer" />
  </div>
</template>

<script>
export default {
  name: 'App',
  computed: {
    config () {
      return this.$root.getConfig()
    }
  },
  mounted () {
    document.title = this.config.name || this.config.header.logo.title
  }
}
</script>

<style scoped>
.doc-body {
  display: flex;
}

.doc-header {
  width: 100%;
}

@media (min-width: 1024px) {
  .doc-body {
    display: flex;
    width: 1024px;
    margin: 0 auto;
  }
  .doc-header .doc-header-container {
    width: 1024px;
    margin: 0 auto;
  }
}
.doc-menus {
  width: 244px;
}
.doc-content {
  flex: 1;
  padding: 15px;
}
</style>
