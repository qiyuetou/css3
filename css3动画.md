##CSS3动画
一.transition（过渡）

1.1 transition的使用注意

- 目前，各大浏览器（包括IE 10）都已经支持无前缀的transition，所以transition已经可以很安全地不加浏览器前缀。
- 不是所有的CSS属性都支持transition，完整的列表查看这里，以及具体的效果。
- transition需要明确知道，开始状态和结束状态的具体数值，才能计算出中间状态。比如，height从0px变化到100px，transition可以算出中间状态。但是，transition没法算出0px到auto的中间状态，也就是说，如果开始或结束的设置是height: auto，那么就不会产生动画效果。类似的情况还有，display: none到block，background: url(foo.jpg)到url(bar.jpg)等等。
1.2 transition的局限

transition的优点在于简单易用，但是它有几个很大的局限。

（1）transition需要事件触发，所以没法在网页加载时自动发生。

（2）transition是一次性的，不能重复发生，除非一再触发。

（3）transition只能定义开始状态和结束状态，不能定义中间状态，也就是说只有两个状态。

（4）一条transition规则，只能定义一个属性的变化，不能涉及多个属性。

CSS Animation就是为了解决这些问题而提出的
二. Animation

animation-direction动画是否反向播放

~~~css
normal
每个循环内动画向前循环，换言之，每个动画循环结束，动画重置到起点重新开始，这是默认属性。
alternate
动画交替反向运行，反向运行时，动画按步后退，同时，带时间功能的函数也反向，比如，ease-in 在反向时成为ease-out。计数取决于开始时是奇数迭代还是偶数迭代
reverse
反向运行动画，每周期结束动画由尾到头运行。
alternate-reverse
反向交替， 反向开始交替
动画第一次运行时是反向的，然后下一次是正向，后面依次循环。决定奇数次或偶数次的计数从1开始。
~~~

animation-iteration-count 
- infinite无限循环
- 次数 数字

animation-play-state(定义一个动画是否运行或者暂停)

- running  当前动画正在运行。
- paused  当前动画以被停止

animation-timing-function

- linear	 平滑，相同的速度
- ease	 先慢后快再慢
- ease-in	以慢速开始
- ease-out	以慢速结束
- ease-in-out	以慢速开始和结束的过渡效果

会引起界面重绘的属性
- offsetTop, offsetLeft, offsetWidth
- offsetHeight
- scrollTop/Left/Width/Height
- clientTop/Left/Width/Height
- width,height
- 请求了getComputedStyle()

css可以动画属性 

~~~
border / color / backgorund / height、width / left、right、top、bottom / padding / margin / opacity / font-size / box-shadow / text-shadow  / transform
~~~

[ MDN 可动画的属性列表](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_animated_properties)

~~~css
简写顺序
@keyframes duration | timing-function | delay | iteration-count | direction | fill-mode | play-state | name 

animation: 3s ease-in 1s 2 reverse both paused slidein;

@keyframes duration | timing-function | delay | name 
animation: 3s linear 1s slidein;

 @keyframes duration | name 
 animation: 3s slidein;
~~~

###三 transform 变形

> 主要包括旋转(rotate)、扭曲(skew)、缩放(scale)、移动(translate)和矩阵变形(matrix)。
[工具](http://westciv.com)
####2d转换
- translate(x,y) translateX translateY平移 
- rotate(xdeg) 沿着顺时针旋转，允许负值 (deg结尾)
- scale(x,y) scaleX scaleY尺寸缩放 scale默认是居中缩放
- skew(x,y) skewX skewY根据给定的水平线和垂直线进行给定角度的翻转 
- matrix()把所有的2d转换方法结合在一起

```javascript
transform: scale(a);         元素x和y方向均缩放a倍
transform: scale(a, b);      元素x方向缩放a倍，y方向缩放b倍
transform: scaleX(a);        元素x方向缩放a倍，y方向不变
transform: scaleY(b);        元素y方向缩放b倍，x方向不变
```
###3D转换

- 3D位移：CSS3中的3D位移主要包括translateZ()和translate3d()两个功能函数；
[例子](https://www.puritys.me/filemanage/files/translate.html)
- 3D旋转：CSS3中的3D旋转主要包括rotateX()、rotateY()、rotateZ()和rotate3d()四个功能函数；
[例子](https://www.puritys.me/filemanage/files/rotate1.html)(rotate3d 代表 在3D空间，元素沿着 经过原点(0,0,0) 和 三维坐标(x,y,z) 2点的直线进行旋转)

- 3D缩放：CSS3中的3D缩放主要包括scaleZ()和scale3d()两个功能函数；
- 3D矩阵：CSS3中3D变形中和2D变形一样也有一个3D矩阵功能函数matrix3d()。
[例子](https://www.puritys.me/docs-blog/article-353-CSS-3D-%E6%97%8B%E8%BD%89-rotate3d-%E8%88%87-translate3d.html)


perspective

~~~
transform-style属性确定元素的子元素是否位于3D空间中，还是在该元素所在的平面内被扁平化。
- preserve-3d 指定子元素定位在三维空间内。
- flat  指定子元素位于此元素所在平面内
~~~

###perspective

perspective(透视距)
距离越远，数值越大，透视感越小；距离越近，数值越小，透视感越强。

[查看demo](https://3dtransforms.desandro.com/perspective)

> 有两种书写形式

~~~
第二种就是用在动画元素们的共同父辈元素上
#stage {
    perspective: 600px;
}
第二种就是用在当前动画元素上
#stage .box {
    transform: perspective(600px) rotateY(45deg);
}
在多元素时两者有区别
~~~

###backface-visibility
属性指定当元素背面朝向观察者时是否可见。元素的背面总是透明的，当其朝向观察者时，显示正面的镜像。

~~~
backface-visibility: visible;(表示背面可见，允许显示正面的镜像。)
backface-visibility : hidden; (表示背面不可见。)
~~~
###transform-style

~~~
 值可以为 flat | preserve-3d
transform-style: preserve-3d; 用于触发子元素三维展示
~~~

三 canvas

