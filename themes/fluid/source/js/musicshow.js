!(function() {
  function show() {
         //直接把音乐框隐藏
		$("#music_div").attr("style","opacity: 0;visibility:hidden; transition: .4s;");
         //滚动条事件
		$(window).scroll(function(){
			//获取滚动条的滑动距离
			var scroH = $(this).scrollTop();
			//滚动条的滑动距离大于120，就显示，反之就隐藏
			if(scroH >= 120){
        console.log(111);
				$("#music_div").attr("style","opacity: 1;visibility:visible;position:fixed;bottom:0px;left:30px;z-index:999;");
			}else if(scroH < 120){
				$("#music_div").attr("style","opacity: 0;visibility:hidden;");
			}
		 })
  }
  show();
})();