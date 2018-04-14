<template>
    <div class = "ue-box">
        <UE :config = config ref = "ue" ></UE>
    </div>
  </div>
</template>
<script>
    import { mapActions } from "vuex" 
    import UE from './UEditor'
    export default {
        components:{
            UE
        },
        data() {
            return {
                config: {
                    initialFrameWidth: null,
                    initialFrameHeight: 300,
                    toolbars: [['source', '|', 'undo', 'redo', '|','bold', 'italic', 'underline',  'strikethrough','superscript', 'subscript', '|', 'forecolor', 'backcolor','selectall', 'removeformat','|', 'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|','lineheight','insertorderedlist', 'insertunorderedlist','imagenone', 'imageleft', 'imageright', 'imagecenter', '|','simpleupload',  'insertimage','emotion', 'customstyle', 'paragraph', 'fontfamily', 'fontsize', '|', 'link','anchor', '|','attachment','insertcode', 'horizontal','spechars', '|', 'searchreplace', 'drafts']]
                }
            }
        },
        created(){
            this.confirmToken()
        },
        methods: {
            ...mapActions(["confirmToken"])
        }
    }
</script>
<style lang = "less">
    .ue-box{
        background: #195f88;
    }
</style>