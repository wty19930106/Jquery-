class Uploads {
  constructor(that) {
    this.settings = {
      readFile:null,
      btn:null,
      view:function(){},
      uploadEndMount:function(){},
      actionMount:function(){},
      progressMount:function(){}
    }
    this.num = 0,
    this.arr = []
  }
  init(opt){
    let _this = this;
    $.extend(this.settings,opt);
    if (this.settings.readFile) {
      this.settings.readFile.change(function(ev){
        _this.addPic(ev.target.files[0]);
        ev.target.value= '';
      });
    }
    if (this.settings.btn) {
      this.settings.btn.click(function() {
        _this.send();
      });
    }
  }
  addPic(data){
    if (!this.arr.some(e=>e.name==data.name)) {
        this.arr.push(data);
        this.settings.view(data)
    }
  }
  send(){
    let _this = this;
    this.settings.actionMount(this.arr);
    this.arr.forEach(e=>{
      let formData = new FormData;
      formData.append('file',e);
      $.ajax({
        url:'php/post_file.php',
        method:'post',
        data:formData,
        processData:false,
        contentType:false,
        success:function(data){
            _this.num++;
            _this.settings.progressMount(_this.num,_this.arr.length);
            if (_this.num == _this.arr.length) {
              _this.settings.uploadEndMount();
              _this.arr.length= 0;
              _this.num = 0;
            }
        }
      })
    })
  }

  changeData(data,callback){
    var fr = new FileReader;
    fr.onload = function(){
      callback(fr.result);
    }
    fr.readAsDataURL(data)
  }
  removeData(name){
    this.arr = this.arr.filter(e=>e.name != name);
  }
}

$.fn.extend({
  uploads(opt){
    let uploads = new Uploads(this);
    uploads.init(opt);
    return {that:this,up:uploads};
  },
  msk(val){
    this.html(val);
    this.animate({
      top:0
    });
    this.delay(800).animate({
      top:-40
    })
  }
})
