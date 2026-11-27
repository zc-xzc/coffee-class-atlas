# Coffee Atlas · 八日咖啡课

A public teaching edition of eight days at the coffee bar. Read in Chinese, English or an English-led teacher view with Chinese and tone-marked pinyin. The lessons, drinks, photographs, history and step-by-step practice use local files. External reading and original image sources require an internet connection.

## 在本机打开 / Open locally

完整解压后，用浏览器打开 `index.html`。右上角切换简体中文、English 或 Teacher。文件夹内的图片需和网页保存在一起。

Extract the whole ZIP and open `index.html` in a browser. Use the language menu, then choose a lesson or drink. Direct routes include `#zh/home`, `#en/drinks` and `#teacher/day/8`.

## 第八天 / Day 8

打开网页后，在课程目录选择「第 8 天」。Direct lesson routes: `#zh/day/8`, `#en/day/8`, `#teacher/day/8`.

第八天对照两杯的冷奶、奶泡和甜味来源。西班牙冰拿铁的配料表写 15 mL 炼乳，操作步骤另写 1 oz。课堂实际用量待确认。

Day 8 compares the milk, foam and sweetener in two iced drinks. For the Spanish iced latte, the ingredient list gives 15 mL of condensed milk and the instructions give 1 oz. The class quantity is still to be confirmed.

第八天新增七张实拍图，展示炼乳加入浓缩、搅拌与倾倒、冰饮杯面和两杯叶纹练习。教师视图配有看图问句和拼音。

Seven Day 8 photos follow the mixing and pouring of the Spanish iced latte, compare the surfaces of iced drinks and show two leaf-pattern exercises. Teacher mode includes a question and Mandarin pinyin with each image.

## 观看短片 / Watch the film

宣传片回顾前七天的课程。课程首页和导航都可进入宣传片。在同一个播放器里选择普通话或 English，字幕也可切换中文或英文。全片 86 秒，分为 10 段，点击各段可直接播放，也可前往对应课程。中文界面默认讲普通话，英语和教师界面默认讲英语。讲解为重新制作的合成声音。下载整站并解压后，视频、两种语言的讲解、字幕、课程与图片均可离线使用。参考网站需联网。

The film covers Days 1–7. Open Film from the home page or the course navigation. The same player offers Mandarin and English narration with a choice of Chinese or English captions. Its ten chapters link back to the lessons. The film, both voices, captions and course materials work in the extracted offline edition. External references need an internet connection. Direct routes include `#zh/film`, `#en/film` and `#teacher/film`.

## GitHub Pages

把本包解压出的内容放到一个独立仓库的根目录，使 `index.html` 和 `.nojekyll` 直接位于根目录。GitHub 仓库的 Settings → Pages → Build and deployment 选择 Deploy from a branch，选择存放这些文件的分支和 /(root)。发布成功后使用 Pages 显示的实际地址。分支示例为 main。所有本地资源使用相对地址，因此支持项目子路径。

Place these files in the publishing branch’s root, with both `index.html` and `.nojekyll` at that level. Select that branch and /(root) in the repository’s Pages settings. No package installation or server-side code is required. [GitHub Pages documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

## 公开素材 / Media permissions

`public-media.json` lists the reviewed still images, their origins, reuse terms and SHA-256 checksums. Website credits are available in the Sources tab. Student-made coffee photographs are included with permission for this educational edition, without a general downstream license. Each third-party work retains the license identified on its own record and file page. The photographer links, credits, licenses and change notices travel with the pictures.

每次增加素材前，先查看完整画面、拍摄来源及授权。作品照可按提供者授权收录。本次逐项审阅中保留为私密的白板、投影及课堂照片仅收录在私人版，课堂现场片段也仅在私人版。图源与原作者链接随图保留。本版收录审核过的静态照片，以及本次制作的中英双语讲解宣传片、字幕、海报与分镜文字。请勿把私人课程 ZIP 或 Git 历史合并到该目录。

在仓库根目录运行 `python3 check_release.py`（Windows 也可用 `py check_release.py`）。清单外文件、已审照片或宣传片的字节变化都会触发失败。只有完成新的素材审核后再更新清单。该检查验证已审清单与实际字节的一致性；新增照片的画面和使用条件需要人工核对。

Run `python3 check_release.py` before release. Keep the private full edition and its assets outside this repository. This audit verifies the complete file list and reviewed hashes, including one film in two audio languages with timed captions, a poster and a scene list. Each additional movie requires a new review. Visually review new pictures and their rights before changing the release manifest.
