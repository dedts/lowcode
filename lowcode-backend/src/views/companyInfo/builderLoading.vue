<template>
  <div class="loadingWrap">
    <div class="loadingSection">
      <div class="loadingBox">
        <div class="bg1" />
        <div class="bg2" />
        <div class="pr1" />
        <div class="pr2" />
        <div class="content">
          <img src="@/assets/noCodeLogo.png" class="noCodeLogo">
          <img src="@/assets/noCodeText.png" class="noCodeText">
        </div>
      </div>
    </div>
  </div>
</template>
<style>
  .loadingWrap { height:100vh; background:#222222; overflow:hidden; }
  .loadingSection { margin:-136px 0 0 -136px; width:272px; height:272px;  position:absolute; left:50%; top:50%; z-index: 3; }
  .loadingBox .noCodeLogo { margin:100px auto 10px; display:block; }
  .loadingBox .noCodeText { margin:0 auto; display:block; }
  .loadingBox { position:relative; }
  .content { width:260px; height:260px; border-radius:50%; position:absolute; top:6px; left:6px; z-index:5; background:#222222; }
  .bg1 { width:136px; height:272px; border-radius: 272px 0 0 272px; background:#595959; position:absolute; z-index:3; }
  .bg2 { width:136px; height:272px; border-radius: 0 272px 272px 0; background:#595959; position:absolute; left:136px; z-index:1; }
  .pr1 { width:136px; height:272px; border-radius: 0 272px 272px 0; background:#4557F6; position:absolute; left:136px; z-index:2;
    transform: rotate(-180deg);
    transform-origin: 0px 136px;
    animation: pr1A 5s 1 linear forwards; }
  .pr2 { border-radius: 0 272px 272px 0; background:#4557F6; position:absolute; left:136px; z-index:4;
    transform: rotate(-180deg);
    transform-origin: 0px 136px;
    animation: pr2A 5s 1 linear forwards; }
  @keyframes pr1A {
    0% {
      transform: rotate(-180deg);
    }
    50% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(0deg);
    }
  }
  @keyframes pr2A {
    0% {
      transform: rotate(-180deg);
    }
    100%{
      width: 136px;
      height: 272px;
      transform: rotate(180deg);
    }
  }
</style>
<script>
export default {
  mounted() {
    setTimeout(function() {
      location.href = 'https://work.huberbuy.com'
    }, 4900)
  }
}
</script>
