$(function(){
    // $("선택자").css({"속성":"값"})
    $("*").css({"margin":0, "padding":0})
    $(".wrap").css({"margin-bottom":50})
    $("ul").css({"display":"flex", "gap":20})
    $("li").css({"list-style":"none"})
    $("ul .red").css({"background":"red", "width":200, "height":200, "border":"1px #000 solid"})
    $("ul .orange").css({"background":"orange", "width":200, "height":200, "border":"1px #000 solid"})
    $("ul .yellow").css({"background":"yellow", "width":200, "height":200, "border":"1px #000 solid"})
    $("ul .green").css({"background":"green", "width":200, "height":200, "border":"1px #000 solid"})

    // 숨김 버튼을 클릭하면 li:first-child 숨김
    // 별명 지을 때는 2가지 옵션
    // class = "별명" 
    // id = "별명" (중복헤서 사용하지 않을 때)
    $("#btn1").click(function(){
        $("ul li:first-child").hide()
    })

    // 보이기 버튼을 클릭하면 li:fisrt-child 보이게
    $("#btn2").click(function(){
        $("ul li:first-child").show()
    })

    // 토글(보이기/숨김)버튼을 클릭하면 li:nth-child(3)
    $("#btn3").click(function(){
        $("ul li:nth-child(3)").toggle()
    })

    // 네번째 버튼 클릭하면 사이즈 100*100으로  li:last-child
    $("#btn4").click(function(){
        $("ul li:nth-child(4)").width(100)
        $("ul li:nth-child(4)").height(100)
    })

    // 원상복구 시키기
    $("#btn5").click(function(){
        $("ul li:nth-child(4)").width(200)
        $("ul li:nth-child(4)").height(200)
        $("ul li:nth-child(3)").show()
        $("ul li:first-child").show()
    })

})    