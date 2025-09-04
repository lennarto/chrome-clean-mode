> [!IMPORTANT]
> ✨ **This is the Chrome Addon.**  
> 👉 The CLI version is here: **[lennarto/open-existing-tab-addon](https://github.com/lennarto/reopen-existing-tab)**



<div align="center">
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="icons/icon-512.png" width="100">
  <source media="(prefers-color-scheme: light)" srcset="images/logo_light.svg" width="100">
  <img alt="Fallback image description" src="icons/icon-512.png" width="300">
</picture>
</div>

<h3 align="center">
    Simple Chrome Addon to (re)open a specific URL via bookmark. If no such tab exists, it opens a new one.
</h3>

<img src="images/demo.gif" alt="Demo GIF" >

## 🚀 Installation via Chrome Web Store

<a href="https://chromewebstore.google.com/detail/outlook-web-copy-link/apfgdjfahgmocjbiiackcfhilgpcjgoe?hl=de&authuser=1">
  <img src="icons/chrome_web_store.png" alt="Install from Chrome Web Store" width="260"/>
</a>


## 🔥 Usage 
Replace in the bookmarks:

```https://x.com```

with

```javascript:window.postMessage({type:'REOPEN_REQUEST',url:'https://x.com'},'*')```

### 💪 Pro Tip
1. go to Bookmarks >>> chrome://bookmarks
2. Export bookmarks (top right ...)
3. Open in Text Editor
4. Replace old urls with new urls, **</b>this will keep the original icons !!!**

Example: Replace ...

```<DT><A HREF="https://mail.google.com/mail/u/0/#inbox" ADD_DATE="1726411430" ICON="data:image/png;base64,iVBORw0KGgoAAA ..."></A>```

... with ... 

```<DT><A HREF="javascript:window.postMessage({type:'REOPEN_REQUEST',url:'https://mail.google.com/mail/u/0/#inbox'},'*')" ADD_DATE="1726411430" ICON="data:image/png;base64,iVBORw0KGgoAAA ..."></A>```

5. Import bookmarks (top right ... same page as export ...)