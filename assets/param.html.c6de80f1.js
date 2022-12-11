import{_ as t,r as p,o,c,a as n,d as s,b as e,e as i}from"./app.a6de780b.js";const l={},r=i(`<p>Explain how to define path parameter using the jin-frame.</p><h2 id="url" tabindex="-1"><a class="header-anchor" href="#url" aria-hidden="true">#</a> url</h2><p>You have to add a variable to url to use path parameter. The url variable can be added with special character <code>:</code> and you can add url to the want path.</p><div class="language-typescript ext-ts line-numbers-mode"><pre class="language-typescript"><code><span class="token keyword">class</span> <span class="token class-name">GetHeroFrame</span> <span class="token keyword">extends</span> <span class="token class-name">JinFrame</span> <span class="token punctuation">{</span>
  <span class="token decorator"><span class="token at operator">@</span><span class="token function">JinFrame</span></span><span class="token punctuation">.</span><span class="token function">param</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
  <span class="token keyword">public</span> <span class="token keyword">readonly</span> comicId<span class="token operator">:</span> <span class="token builtin">number</span><span class="token punctuation">;</span>

  <span class="token decorator"><span class="token at operator">@</span><span class="token function">JinFrame</span></span><span class="token punctuation">.</span><span class="token function">param</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
  <span class="token keyword">public</span> <span class="token keyword">readonly</span> heroId<span class="token operator">:</span> <span class="token builtin">number</span><span class="token punctuation">;</span>

  <span class="token function">constructor</span><span class="token punctuation">(</span>comicId<span class="token operator">:</span> <span class="token builtin">number</span><span class="token punctuation">,</span> heroId<span class="token operator">:</span> <span class="token builtin">number</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">super</span><span class="token punctuation">(</span><span class="token punctuation">{</span> host<span class="token operator">:</span> <span class="token string">&#39;http://api.marvel-comics.com&#39;</span><span class="token punctuation">,</span> path<span class="token operator">:</span> <span class="token string">&#39;/comic/:comicId/hero/:heroId&#39;</span><span class="token punctuation">,</span> method<span class="token operator">:</span> <span class="token string">&#39;POST&#39;</span> <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token keyword">this</span><span class="token punctuation">.</span>comicId <span class="token operator">=</span> comicId<span class="token punctuation">;</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>heroId <span class="token operator">=</span> heroId<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code>GetHeroFrame</code> use two url parameter. <code>comicId</code>and <code>heroId</code> were used to represent the two ids in the url path.</p><h2 id="type" tabindex="-1"><a class="header-anchor" href="#type" aria-hidden="true">#</a> type</h2><p><code>param()</code> function use <code>string</code> and <code>number</code>, <code>boolean</code>, <code>Date</code> type. You can also use <code>string[]</code>, <code>number[]</code>, <code>boolean[]</code>, <code>Date[]</code>,<code>object</code> types(array of primitive type), but if you use them, they are automatically converted to strings, so be careful when using them.</p><h2 id="formatters" tabindex="-1"><a class="header-anchor" href="#formatters" aria-hidden="true">#</a> formatters</h2><p>The <code>param()</code> function can be changed to the wanted value using the formatters. The example below shows how to declare an epoch number type variable as a Date type and change the Date type to a number type using the getUnixTime function when the epoch variable is included in the request.</p><p><code>getUnixTime</code> function is included in package <code>date-fns</code>.</p><div class="language-typescript ext-ts line-numbers-mode"><pre class="language-typescript"><code><span class="token keyword">import</span> getUnixTime <span class="token keyword">from</span> <span class="token string">&#39;date-fns/getUnixTime&#39;</span><span class="token punctuation">;</span>

<span class="token keyword">class</span> <span class="token class-name">GetHeroFrame</span> <span class="token keyword">extends</span> <span class="token class-name">JinFrame</span> <span class="token punctuation">{</span>
  <span class="token decorator"><span class="token at operator">@</span><span class="token function">JinFrame</span></span><span class="token punctuation">.</span><span class="token function">param</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
    formatter<span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token function-variable function">dateTime</span><span class="token operator">:</span> <span class="token punctuation">(</span>value<span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span><span class="token function">getUnixTime</span><span class="token punctuation">(</span>value<span class="token punctuation">)</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">\`</span></span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span>
  <span class="token keyword">public</span> <span class="token keyword">readonly</span> epoch<span class="token operator">:</span> Date<span class="token punctuation">;</span>

  <span class="token function">constructor</span><span class="token punctuation">(</span>epoch<span class="token operator">:</span> Date<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">super</span><span class="token punctuation">(</span><span class="token punctuation">{</span> host<span class="token operator">:</span> <span class="token string">&#39;http://api.marvel-comics.com&#39;</span><span class="token punctuation">,</span> path<span class="token operator">:</span> <span class="token string">&#39;/release/:epoch&#39;</span><span class="token punctuation">,</span> method<span class="token operator">:</span> <span class="token string">&#39;POST&#39;</span> <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token keyword">this</span><span class="token punctuation">.</span>epoch <span class="token operator">=</span> epoch<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>formatters have three function like number, dateTime, string. Each function can be an input value for another formatters function.</p><div class="language-typescript ext-ts line-numbers-mode"><pre class="language-typescript"><code><span class="token keyword">import</span> getUnixTime <span class="token keyword">from</span> <span class="token string">&#39;date-fns/getUnixTime&#39;</span><span class="token punctuation">;</span>

<span class="token keyword">class</span> <span class="token class-name">GetEpochFormatFrame</span> <span class="token keyword">extends</span> <span class="token class-name">JinFrame</span> <span class="token punctuation">{</span>
  <span class="token decorator"><span class="token at operator">@</span><span class="token function">JinFrame</span></span><span class="token punctuation">.</span><span class="token function">param</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
    formatter<span class="token operator">:</span> <span class="token punctuation">{</span>
      order<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">&#39;number&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;dateTime&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;string&#39;</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
      <span class="token function-variable function">number</span><span class="token operator">:</span> <span class="token punctuation">(</span>value<span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token function">getUnixTime</span><span class="token punctuation">(</span>value <span class="token operator">+</span> <span class="token number">86400</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
      <span class="token function-variable function">dateTime</span><span class="token operator">:</span> <span class="token punctuation">(</span>value<span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token function">liteFormat</span><span class="token punctuation">(</span>value<span class="token punctuation">,</span> <span class="token string">&#39;yyyyMMddHHmmss&#39;</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span>
  <span class="token keyword">public</span> <span class="token keyword">readonly</span> epoch<span class="token operator">:</span> <span class="token builtin">number</span><span class="token punctuation">;</span>

  <span class="token function">constructor</span><span class="token punctuation">(</span>epoch<span class="token operator">:</span> <span class="token builtin">number</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">super</span><span class="token punctuation">(</span><span class="token punctuation">{</span> host<span class="token operator">:</span> <span class="token string">&#39;http://api.marvel-comics.com&#39;</span><span class="token punctuation">,</span> path<span class="token operator">:</span> <span class="token string">&#39;/release/:epoch&#39;</span><span class="token punctuation">,</span> method<span class="token operator">:</span> <span class="token string">&#39;POST&#39;</span> <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token keyword">this</span><span class="token punctuation">.</span>epoch <span class="token operator">=</span> epoch<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code>GetEpochFormatFrame</code> adds 1 day to the epoch variable, converts it to a Date type using the getUnixTime function, and converts it to a string using the liteFormat function. <code>GetEpochFormatFrame</code> is an example. You can find another efficiency way to add a day and text it&#39;s</p><p><code>order</code> option deside that order of formatter apply. Default values are <code>[&#39;number&#39;, &#39;string&#39;, &#39;dateTime&#39;]</code></p><h2 id="array" tabindex="-1"><a class="header-anchor" href="#array" aria-hidden="true">#</a> Array</h2><p><code>param()</code> can pass an array of primitive type, but you have to converted to a string before it can be applied to url.</p><p>When the comma option is set to true, the array is combined with a <code>,</code> character to convert it into a plain string.</p><div class="language-typescript ext-ts line-numbers-mode"><pre class="language-typescript"><code><span class="token keyword">class</span> <span class="token class-name">GetHeroFrame</span> <span class="token keyword">extends</span> <span class="token class-name">JinFrame</span> <span class="token punctuation">{</span>
  <span class="token decorator"><span class="token at operator">@</span><span class="token function">JinFrame</span></span><span class="token punctuation">.</span><span class="token function">param</span><span class="token punctuation">(</span><span class="token punctuation">{</span> comma<span class="token operator">:</span> <span class="token boolean">true</span> <span class="token punctuation">}</span><span class="token punctuation">)</span>
  <span class="token keyword">public</span> <span class="token keyword">readonly</span> skill<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>

  <span class="token decorator"><span class="token at operator">@</span><span class="token function">JinFrame</span></span><span class="token punctuation">.</span><span class="token function">param</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
  <span class="token keyword">public</span> <span class="token keyword">readonly</span> heroId<span class="token operator">:</span> <span class="token builtin">number</span><span class="token punctuation">;</span>

  <span class="token function">constructor</span><span class="token punctuation">(</span>comicId<span class="token operator">:</span> <span class="token builtin">number</span><span class="token punctuation">,</span> heroId<span class="token operator">:</span> <span class="token builtin">number</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">super</span><span class="token punctuation">(</span><span class="token punctuation">{</span> host<span class="token operator">:</span> <span class="token string">&#39;http://api.marvel-comics.com&#39;</span><span class="token punctuation">,</span> path<span class="token operator">:</span> <span class="token string">&#39;/comic/:comicId/hero/:heroId&#39;</span><span class="token punctuation">,</span> method<span class="token operator">:</span> <span class="token string">&#39;POST&#39;</span> <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token keyword">this</span><span class="token punctuation">.</span>comicId <span class="token operator">=</span> comicId<span class="token punctuation">;</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>heroId <span class="token operator">=</span> heroId<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>If declared as a array of primitive type, such as <code>GetHeroFrame</code>, when the comma option is set to true that will be combine into a string using <code>,</code> character. When comma optoin is set to false or undefined that will be json serialize.</p><h2 id="examples" tabindex="-1"><a class="header-anchor" href="#examples" aria-hidden="true">#</a> Examples</h2>`,21),u={href:"https://github.com/imjuni/jin-frame/blob/master/src/__tests__",target:"_blank",rel:"noopener noreferrer"},d={href:"https://github.com/imjuni/jin-frame/blob/master/examples",target:"_blank",rel:"noopener noreferrer"},k={href:"https://github.com/imjuni/jin-frame/blob/master/src/__tests__/jinframe.get.test.ts",target:"_blank",rel:"noopener noreferrer"},m={href:"https://github.com/imjuni/jin-frame/blob/master/src/__tests__/overlap.get.ts",target:"_blank",rel:"noopener noreferrer"},v={href:"https://github.com/imjuni/jin-frame/blob/master/examples/CommaSeperatedGetFrame.ts",target:"_blank",rel:"noopener noreferrer"},h={href:"https://github.com/imjuni/jin-frame/blob/master/examples/OverlapDecoratorGetFrame.ts",target:"_blank",rel:"noopener noreferrer"};function b(f,g){const a=p("ExternalLinkIcon");return o(),c("div",null,[r,n("p",null,[s("You can found more example in "),n("a",u,[s("testcase"),e(a)]),s(" and "),n("a",d,[s("examples"),e(a)]),s(".")]),n("ul",null,[n("li",null,[n("a",k,[s("jinframe.get.test.ts"),e(a)])]),n("li",null,[n("a",m,[s("overlap.get.ts"),e(a)])]),n("li",null,[n("a",v,[s("CommaSeperatedGetFrame.ts"),e(a)])]),n("li",null,[n("a",h,[s("OverlapDecoratorGetFrame.ts"),e(a)])])])])}const w=t(l,[["render",b],["__file","param.html.vue"]]);export{w as default};