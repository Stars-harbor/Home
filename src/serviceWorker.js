// 这个函数用来注册 service worker
export function register(config) {
  // 检查当前环境是否为生产环境，并且浏览器是否支持 service worker
  if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
    const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);
    // 确保 PUBLIC_URL 和当前页面在同一个源（origin）
    if (publicUrl.origin !== window.location.origin) {
      return;
    }

    // 当窗口加载完毕时注册 service worker
    window.addEventListener('load', () => {
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

      if (isLocalhost) {
        // 如果是本地环境，检查 service worker 是否存在
        checkValidServiceWorker(swUrl, config);

        // 提示开发者，应用正在被 service worker 缓存
        navigator.serviceWorker.ready.then(() => {
          console.log(
            'This web app is being served cache-first by a service ' +
              'worker. To learn more, visit https://cra.link/PWA'
          );
        });
      } else {
        // 不是本地环境，直接注册 service worker
        registerValidSW(swUrl, config);
      }
    });
  }
}

// 这个函数用来注册有效的 service worker
function registerValidSW(swUrl, config) {
  navigator.serviceWorker
    .register(swUrl)
    .then(registration => {
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        if (installingWorker == null) {
          return;
        }
        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              // 当有新内容时，强制重新加载页面
              console.log(
                'New content is available and will be used when all ' +
                  'tabs for this page are closed. See https://cra.link/PWA.'
              );

              // 使用新的 service worker 进行页面更新
              if (config && config.onUpdate) {
                config.onUpdate(registration);
              }
            } else {
              // 没有新的内容，只是初次安装
              console.log('Content is cached for offline use.');

              if (config && config.onSuccess) {
                config.onSuccess(registration);
              }
            }
          }
        };
      };
    })
    .catch(error => {
      console.error('Error during service worker registration:', error);
    });
}

// 这个函数检查 service worker 是否存在并且有效
function checkValidServiceWorker(swUrl, config) {
  fetch(swUrl, {
    headers: { 'Service-Worker': 'script' },
  })
    .then(response => {
      const contentType = response.headers.get('content-type');
      if (
        response.status === 404 ||
        (contentType != null && contentType.indexOf('javascript') === -1)
      ) {
        // 如果找不到 service worker 或者它不是一个 JavaScript 文件，注销当前 service worker
        navigator.serviceWorker.ready.then(registration => {
          registration.unregister().then(() => {
            window.location.reload();
          });
        });
      } else {
        // 如果找到 service worker，注册它
        registerValidSW(swUrl, config);
      }
    })
    .catch(() => {
      console.log(
        'No internet connection found. App is running in offline mode.'
      );
    });
}

// 注销 service worker 的函数
export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then(registration => {
        registration.unregister();
      })
      .catch(error => {
        console.error(error.message);
      });
  }
}
