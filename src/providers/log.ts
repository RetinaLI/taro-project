

export default class Log {

  static info (...args) {
    if (process.env.TARO_ENV !== 'h5') {
      return console.info(arguments);
    }
    let time = Date.now();

    let $content = document.getElementById('my-log-content');
    if (!$content) {
      let $div = document.createElement('div');
      $div.id = 'my-log';
      $div.style.position = 'fixed';
      $div.style.zIndex = '9999999';
      $div.style.right = '0px';
      $div.style.top = '0px';
      $div.style.width = '60%';
      $div.style.height = '60%';
      $div.style.border = "1px solid red";
      $div.style.backgroundColor = "rgba(0,0,0, .5)";

      $content = document.createElement('div');
      $content.id = "my-log-content";
      $content.style.display = "block";
      $content.style.width = "100%";
      $content.style.height = "100%";
      $content.style.overflow = "auto";

      let $btn = document.createElement('input');
      $btn.id = "my-log-btn";
      $btn.type = 'button';
      $btn.value = '刷新';
      $btn.style.position = "absolute";
      $btn.style.height = "20px";
      $btn.style.bottom = "-20px";
      $btn.style.left = "0px";
      $btn.style.width = "100%";
      $btn.style.backgroundColor = 'red';
      $btn.style.color = 'white';

      $btn.onclick = function () {
        document.location.href = document.location.href;
      };


      $div.appendChild($content);
      $div.appendChild($btn);

      document.body.appendChild($div);
    }
    let contents = args.map(_content => {
      return typeof _content == 'object' ? JSON.stringify(_content) : _content;
    });
    let viewContent = contents.join('    ');
    viewContent = `<p style="border-bottom: 1px solid #ccc; display: block; width: 100%; text-align: left; color: white; font-size: 16px"><span style="color:red">${time}:</span> ${viewContent}</p>`;
    $content.innerHTML += viewContent;
    $content.scrollTop += 99999;
  }
}