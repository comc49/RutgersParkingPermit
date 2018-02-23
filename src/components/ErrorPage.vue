
<template>
    <section id="errorPage">
        <h1 class="display-4 black--text">ERROR</h1>
        <h1 class="display-3 primary--text"><b>{{$router.error}}</b></h1>
        <h1 class="display-3 black--text">PLEASE CONTACT BKOO:</h1>
        <h1 class="display-2 black--text">brian.koo@gpmail.org</h1>
    </section>
</template>

<script>

export default {
}
</script>

<style lang='scss'>
    #errorPage {
        h1:first-child {
            margin-top: 5rem;
        }
    }
</style>
