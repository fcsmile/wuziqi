$(function(){
    var canvas=$('#canvas').get(0);
    var audio=$('audio').get(0);
    var ctx=canvas.getContext('2d');
    var row=15;
    var off=canvas.width/row;
    var width=canvas.width;
    var yingjia=$('.yingjia');
    var winer=$('.winer');
    var winerwhite=$('.winerwhite');
    var blocks={};
    var img=$('.vol');
    var menu=$('.menu');
    var again=$('.again');
    var toptime=$('.toptime');
    var xianxing=$('.xianxing');
    var kaiguan=true;
    $(document).on('mousedown',function(){
        return false
    });
    function p2k(position){
        return position.x+'_'+position.y;
    }
    function o2k(x,y){
        return x+'_'+y;
    }
    function check(pos,color){
        var num=1;
        var shangnum=1;
        var rightnum=1;
        var leftnum=1;
        var table={};
        for(var i in blocks){
            if(blocks[i]==color){
                table[i]=color;
            }
        }

        //左右
        var tx=pos.x;
        var ty=pos.y;
        while(table[(tx+1)+'_'+ty]){
            num++;
            tx++;
        }
        tx=pos.x;
        ty=pos.y;
        while(table[(tx-1)+'_'+ty]){
            num++;
            tx--;
        }


        //上下
        var tx=pos.x;
        var ty=pos.y;
        while(table[tx+'_'+(ty+1)]){
            shangnum++;
            ty++;
        }
        tx=pos.x;
        ty=pos.y;
        while(table[tx+'_'+(ty-1)]){
            shangnum++;
            ty--;
        }


        //左上
        var tx=pos.x;
        var ty=pos.y;
        while(table[(tx+1)+'_'+(ty+1)]){
            leftnum++;
            ty++;
            tx++;
        }
        tx=pos.x;
        ty=pos.y;
        while(table[(tx-1)+'_'+(ty-1)]){
            leftnum++;
            ty--;
            tx--;
        }

        //右上
        var tx=pos.x;
        var ty=pos.y;
        while(table[(tx+1)+'_'+(ty-1)]){
            rightnum++;
            ty--;
            tx++;
        }
        tx=pos.x;
        ty=pos.y;
        while(table[(tx-1)+'_'+(ty+1)]){
            rightnum++;
            ty++;
            tx--;
        }
        // return num>=5||shangnum>=5||leftnum>=5||rightnum>=5;
        return Math.max(num,shangnum,leftnum,rightnum);
    }
    //每次后面加0.5是为了处理半个像素问题；
    //创建横线
    function creatheng(i){
        ctx.beginPath();
        ctx.moveTo(off/2+0.5,off/2+0.5+off*i);
        ctx.lineTo((row-0.5)*off,off/2+0.5+off*i);
        ctx.stroke();
        ctx.closePath();
    }
    //创建竖线
    function creatshu(h){
        ctx.beginPath();
        ctx.moveTo(off/2+0.5+off*h,off/2+0.5);
        ctx.lineTo(off/2+0.5+off*h,(row-0.5)*off);
        ctx.stroke();
        ctx.closePath();
    }
    //小黑点
    function drawcircle(x,y){
        ctx.beginPath();
        ctx.moveTo(x*off+0.5,y*off);
        ctx.arc(x*off+0.5,y*off,3,0,2*Math.PI);
        ctx.fill();
        ctx.closePath();
    }
    //横15 竖15
    function draw(){
        for(var i=0;i<row;i++){
            creatheng(i);
            creatshu(i);
        }


    //写入参考点
     drawcircle(3.5,3.5);
     drawcircle(11.5,3.5);
     drawcircle(7.5,7.5);
     drawcircle(3.5,11.5);
     drawcircle(11.5,11.5);
    }
    draw();
    function k2o(position){
        var arr=position.split('_');
        return zuobiao={
            x:parseInt(arr[0]),
            y:parseInt(arr[1])
        }

    }
    function drawtext(pos,text,color){
        ctx.save();
        ctx.font='15px 微软雅黑';
        ctx.textAlign='center';
        ctx.textBaseline='middle';
        if(color=='white'){
            ctx.fillStyle='black';
        }else if(color='black'){
            ctx.fillStyle='white';
        }
        ctx.fillText(text,(pos.x+0.5)*off,(pos.y+0.5)*off);
        ctx.restore();
    }
    function review(){
        var i=1;
        for(var pos in blocks){
            drawtext(k2o(pos),i,blocks[pos]);
            i++;
        }
    }
    //棋子
    var index=0;
    var t;
    function drawchess(position,color){
        ctx.save();
        ctx.beginPath();
        ctx.translate((position.x+0.5)*off+0.5,(position.y+0.5)*off+0.5);
        // ctx.moveTo((position.x+0.5)*off+0.5,(position.y+0.5)*off+0.5);
        ctx.arc(0,0,15,0,2*Math.PI);
        var radgrad = ctx.createRadialGradient(-6,-6,1,0,0,15);
        radgrad.addColorStop(0, 'rgb(81,78,69)');
        radgrad.addColorStop(0.9, 'rgb(27,28,23)');
        radgrad.addColorStop(1, 'rgba(0,0,0,0)');
        if(color==='black'){
            ctx.fillStyle=radgrad;
            ctx.shadowOffsetX = 1;
            ctx.shadowOffsetY = 1;
            ctx.shadowBlur = 1;
            ctx.shadowColor = "rgba(81,78,69, 0.3)";
            ctx.fill();
            blocks[p2k(position)]='black';
        }else{
            var rad = ctx.createRadialGradient(-6,-6,1,0,0,15);
            rad.addColorStop(0, 'rgb(250,248,227)');
            rad.addColorStop(0.9, 'rgb(182,179,160)');
            rad.addColorStop(1, 'rgba(255,255,255,0)');
            ctx.fillStyle=rad;
            ctx.shadowOffsetX = 1;
            ctx.shadowOffsetY = 1;
            ctx.shadowBlur = 1;
            ctx.shadowColor = "rgba(81,78,69, 0.3)";
            ctx.fill();
            blocks[p2k(position)]='white';
        }
        ctx.closePath();
        ctx.restore();
        // blocks[position.x+'_'+position.y]=color;
        delete blank[p2k(position)];
    }
    var flag=true;
    function  handleclick(e) {
        position={
            x:Math.round((e.offsetX-off/2)/off),
            y:Math.round((e.offsetY-off/2)/off)
        };
        console.log(position.x);
        if(blocks[p2k(position)]){
            return;
        }
        if(ai){
            drawchess(position,'black');
            drawchess(AI(),'white');
            if(check(position,'black')>=5){
                winer.addClass('winerown');
                $(canvas).off('click');
                menu.on('click',function(){
                    winer.removeClass('winerown');
                    review();
                });
                again.on('click',function(){
                    reset();
                    draw();
                    yingjia.css({display:'none'});
                    $(canvas).off('click').on('click',handleclick);
                    winer.removeClass('winerown');
                });
                return;
            }
            if(check(AI(),'white')>5){
                winerwhite.addClass('winerowner');
                $(canvas).off('click');
                menu.on('click',function(){
                    winerwhite.removeClass('winerowner');
                    review();
                });
                again.on('click',function(){
                    reset();
                    draw();
                    yingjia.css({display:'none'});
                    $(canvas).off('click').on('click',handleclick);
                    winerwhite.removeClass('winerowner');
                });
                return;
            }
            return;
        }
        if(flag){
           // t= setInterval(function(){
           //      toptime.css({width:index+=20});
           //      if(index==600){
           //          alert('您输了');
           //          clearInterval(t);
           //
           //      }
           //  },1000);
           //  return;
            drawchess(position,'black');
            if(check(position,'black')>=5){
                 winer.addClass('winerown');
                $(canvas).off('click');
                menu.on('click',function(){
                    winer.removeClass('winerown');
                    review();
                });
                again.on('click',function(){
                    reset();
                    draw();
                    yingjia.css({display:'none'});
                    $(canvas).off('click').on('click',handleclick);
                    winer.removeClass('winerown');
                });
                return;
            }
            flag=false;
        }else{
            drawchess(position,'white');
            if(check(position,'white')>=5){
                winerwhite.addClass('winerowner');
                $(canvas).off('click');
                menu.on('click',function(){
                    winerwhite.removeClass('winerowner');
                    review();
                });
                again.on('click',function(){
                    reset();
                    draw();
                    yingjia.css({display:'none'});
                    $(canvas).off('click').on('click',handleclick);
                    winerwhite.removeClass('winerowner');
                });
                return;
            }
            flag=true;
        }
    }
    console.log($(canvas));
    $(canvas).on('click',handleclick);
    var chongzhi=$('.reset');
    var renji=$('.renji');
    var ai=false;
    var blank={};
    for(var i=0;i<row;i++){
        for(var j=0;j<row;j++){
            blank[o2k(i,j)]=true;
        }
    }
    renji.on('click',function(){
        renji.toggleClass('active');
        if(ai==true){
            ai=false;
        }else if(ai==false){
            ai=true;
        }

    });
    renji.on('click',function(){
        return false;
    });
    function AI(){
    //    遍历所有空白位置；
        var max1=-Infinity;
        var max2=-Infinity;
        var pos1;
        var pos2;
        for(var i in blank){
            var score1=check(k2o(i),'black');
            var score2=check(k2o(i),'white');
            if(score1>max1){
                max1=score1;
                pos1=k2o(i);
            }
            if(score2>max2){
                max2=score2;
                pos2=k2o(i);
            }
        }
        if(max1>=max2){
            return pos1;
        }else{
            return pos2;
        }
    }
    chongzhi.on('click',function(){
        reset();
        draw();
        yingjia.css({display:'none'});
        $(canvas).off('click').on('click',handleclick);
    });
    function reset(){
        ctx.clearRect(0,0,width,width);
        flag=true;
        blocks={};
    }
    //静音
    var audio=$('audio').get(0);
    img.on('click',function(){
        img.addClass('volget');
        if(audio.volume!=0){
            audio.volume=0;
            img.css({backgroundImage:'url(image/jingyin.png)'});
        }else{
            audio.volume=1;
            img.css({backgroundImage:'url(image/jingyin1.png)'});
        }
    });
    audio.onended =function(){
       audio.src='轻音乐.mp3'
    };
    //样式
    var boximg=$('.boximg');
    var jieshao=$('.jieshao');
    var tanchu=$('.tanchu');
    var xuzhi=$('.xuzhi');
    var zhidao=$('.zhidao');
    // boximg.on('click',function(){
    // });
    var zhongbiao=$('.clock');
    var start=$('.start');
    start.on('click',function(){
        boximg.addClass('low');
        renji.addClass('large');
        chongzhi.addClass('large1');
        jieshao.addClass('large2');
        xuzhi.addClass('large3');
        zhongbiao.addClass('large4');
        img.addClass('volget');
        xianxing.addClass('animation');
        // xianxing.addClass('xianxingzou');
        audio.play();
    });
    var end=$('.end');
    end.on('click',function(){
        if
        (confirm("您确定要关闭本页吗？")){
            window.opener=null;
            window.open('','_self');
            window.close();
        }
    });
    jieshao.on('click',function(){
        tanchu.toggleClass('tan');
    });
    xuzhi.on('click',function(){
        zhidao.toggleClass('xu')
    });

//    钟表
    var clock=zhongbiao.get(0);
    var cxt=clock.getContext('2d');
    function timeclock(){
        cxt.clearRect(0,0,200,200);
        function move(){
            cxt.beginPath();
            cxt.arc(0,0,100,0,2*Math.PI);
            cxt.font="14px 苹方";
            cxt.fillText("Trust Yourself!", -48, 50);
            cxt.fillStyle = "Black";
            cxt.shadowColor="rgba(0, 0, 0, 0.2)";
            cxt.shadowOffsetX = 1;
            cxt.shadowOffsetY = 1;
            cxt.shadowBlur = 2;
            cxt.closePath();
            cxt.stroke();
        }
        cxt.save();
        cxt.translate(100,100);
        move();
        for(var i=1;i<=60;i++){
            cxt.rotate(Math.PI/30);
            if(i%5==0){
                cxt.moveTo(0,-100);
                cxt.lineTo(0,-80);
            }else{
                cxt.moveTo(0,-100);
                cxt.lineTo(0,-90)
            }
        }
        cxt.stroke();
        cxt.restore();
//获取时间
        var date=new Date();
        //秒针
        cxt.save();
        cxt.translate(100,100);
        cxt.lineCap='round';
        cxt.beginPath();
        var s=date.getSeconds();
        cxt.rotate(s*2*Math.PI/60);
        cxt.moveTo(0,0);
        // cxt.arc(0,0,15,0,2*Math.PI);
        cxt.lineWidth=3;
        // cxt.moveTo(0,15);
        cxt.lineTo(0,20);
        cxt.moveTo(0,0);
        cxt.lineTo(0,-70);
        cxt.stroke();
        cxt.closePath();

        cxt.restore();
        //分针
        cxt.save();
        cxt.translate(100,100);
        cxt.lineCap="round";
        cxt.lineWidth=5;
        cxt.beginPath();
        var m=date.getMinutes();
        cxt.rotate((m*60+s)*2*Math.PI/3600);
        cxt.moveTo(0,0);
        // cxt.arc(0,0,10,0,2*Math.PI);
        // cxt.moveTo(0,-10);
        cxt.lineTo(0,-50);
        cxt.moveTo(0,0);
        cxt.lineTo(0,10);
        cxt.stroke();
        cxt.closePath();
        cxt.restore();
//            时针
        cxt.save();
        cxt.translate(100,100);
        cxt.lineCap="round";
        cxt.lineWidth=7;
        cxt.beginPath();
        var h=date.getHours();
        cxt.rotate((h*3600+m*60+s)*2*Math.PI/(3600*12));
        cxt.moveTo(0,0);
        // cxt.arc(0,0,5,0,2*Math.PI);
        // cxt.moveTo(0,-5);
        cxt.lineTo(0,-35);
        cxt.moveTo(0,0);
        cxt.lineTo(0,5);
        cxt.stroke();
        cxt.closePath();
        cxt.restore();
    }

    setInterval(timeclock,1000);

});