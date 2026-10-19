
    (function() {
      var preconnectOrigins = ["https://cdn.shopify.com"];
      var scripts = ["/cdn/shopifycloud/checkout-web/assets/c1/polyfills.DsjDEvpF.js","/cdn/shopifycloud/checkout-web/assets/c1/app.B1UEJM_E.js","/cdn/shopifycloud/checkout-web/assets/c1/2c1ab0fe.Dbn2KvkT.js","/cdn/shopifycloud/checkout-web/assets/c1/6a2fc6d6.Cosa-1QR.js","/cdn/shopifycloud/checkout-web/assets/c1/4b4bc88f.BVG-8vs-.js","/cdn/shopifycloud/checkout-web/assets/c1/bfe75f31.CdzI9Lv4.js","/cdn/shopifycloud/checkout-web/assets/c1/2bac2c53.FvZqk_Sq.js","/cdn/shopifycloud/checkout-web/assets/c1/9dba8418.CUU9Kc02.js","/cdn/shopifycloud/checkout-web/assets/c1/cb38e5c2.DSyDHcIP.js","/cdn/shopifycloud/checkout-web/assets/c1/3d539943.Dqh8vmzW.js","/cdn/shopifycloud/checkout-web/assets/c1/2255f8fa.gpqqj3Wm.js","/cdn/shopifycloud/checkout-web/assets/c1/d25d1b95.D4XjhwOr.js","/cdn/shopifycloud/checkout-web/assets/c1/b8733b27.DVp9kpeJ.js","/cdn/shopifycloud/checkout-web/assets/c1/e39bc11c.BWdA5WrW.js","/cdn/shopifycloud/checkout-web/assets/c1/08a3b809.CVBmyqCk.js","/cdn/shopifycloud/checkout-web/assets/c1/164ad2e3.DNQiYH3O.js","/cdn/shopifycloud/checkout-web/assets/c1/69fae6d4.C95_LMnM.js","/cdn/shopifycloud/checkout-web/assets/c1/f67abd2c.BJ4Oar_u.js","/cdn/shopifycloud/checkout-web/assets/c1/e12db40c.BATxw89L.js","/cdn/shopifycloud/checkout-web/assets/c1/60a453ce.BtOFzRfk.js","/cdn/shopifycloud/checkout-web/assets/c1/ecbc70a8.CeqCKSZg.js","/cdn/shopifycloud/checkout-web/assets/c1/f8706cb6.D3lUO3TO.js","/cdn/shopifycloud/checkout-web/assets/c1/dffdfb34.COkxEXi3.js","/cdn/shopifycloud/checkout-web/assets/c1/3ca8ef7e.DR1P3e7G.js","/cdn/shopifycloud/checkout-web/assets/c1/1f5e7811.DfKsQAhu.js","/cdn/shopifycloud/checkout-web/assets/c1/1a6c2867.D8mTtJ_Z.js","/cdn/shopifycloud/checkout-web/assets/c1/2fdb3dd3.WMnLqSlT.js","/cdn/shopifycloud/checkout-web/assets/c1/22345fd4.lDfLT5hl.js","/cdn/shopifycloud/checkout-web/assets/c1/0e67bd3b.CiYaWEVC.js","/cdn/shopifycloud/checkout-web/assets/c1/74835653.CaIcnzTt.js","/cdn/shopifycloud/checkout-web/assets/c1/a9fa9fda.Ds30UU7w.js","/cdn/shopifycloud/checkout-web/assets/c1/ca3e798e.BBho0lps.js","/cdn/shopifycloud/checkout-web/assets/c1/47b970b2.CPY2nGoJ.js","/cdn/shopifycloud/checkout-web/assets/c1/064f6ac1.BIC1aQqg.js","/cdn/shopifycloud/checkout-web/assets/c1/efa0389a.vKhl98uv.js","/cdn/shopifycloud/checkout-web/assets/c1/4b1c22b7.FNlftD5S.js","/cdn/shopifycloud/checkout-web/assets/c1/17425706.BtEVPbip.js","/cdn/shopifycloud/checkout-web/assets/c1/cb5cf153.Dg2S1aZz.js","/cdn/shopifycloud/checkout-web/assets/c1/e3e348f2.BNwkws-Q.js","/cdn/shopifycloud/checkout-web/assets/c1/71ae3d5c.Di_tSGZ3.js","/cdn/shopifycloud/checkout-web/assets/c1/78ab3dd0.Bvzt-Paf.js","/cdn/shopifycloud/checkout-web/assets/c1/89e2d30a.BRmUDQhA.js","/cdn/shopifycloud/checkout-web/assets/c1/ed9f2238.BewoXymt.js","/cdn/shopifycloud/checkout-web/assets/c1/6fb6f9d8.DifgCYrl.js","/cdn/shopifycloud/checkout-web/assets/c1/1444e6bd.CLS56A6L.js","/cdn/shopifycloud/checkout-web/assets/c1/0b8657b8.rYcNFStj.js","/cdn/shopifycloud/checkout-web/assets/c1/55098bf1.CZYij7Ob.js","/cdn/shopifycloud/checkout-web/assets/c1/a422df8c.DqCsy-7Y.js","/cdn/shopifycloud/checkout-web/assets/c1/f49d4216.BLZFCuNT.js","/cdn/shopifycloud/checkout-web/assets/c1/79974aab.CWrQ0hfU.js","/cdn/shopifycloud/checkout-web/assets/c1/7b0c98ea.C1m82HSq.js","/cdn/shopifycloud/checkout-web/assets/c1/d22d2b80.CSfHczWD.js","/cdn/shopifycloud/checkout-web/assets/c1/f58f39d8.Cq7rzFUq.js","/cdn/shopifycloud/checkout-web/assets/c1/e03065ab.BBx-NAvX.js","/cdn/shopifycloud/checkout-web/assets/c1/0e9ee714.CR-H9GrF.js","/cdn/shopifycloud/checkout-web/assets/c1/39921a74.Mratw4ys.js","/cdn/shopifycloud/checkout-web/assets/c1/7a8217fd.D03wpfl8.js","/cdn/shopifycloud/checkout-web/assets/c1/c6b02d73.BjpLmuyg.js","/cdn/shopifycloud/checkout-web/assets/c1/ec391382.DHzoQU0V.js","/cdn/shopifycloud/checkout-web/assets/c1/24773686.BjRbJMB7.js","/cdn/shopifycloud/checkout-web/assets/c1/2210eadb.DF0gIp_2.js","/cdn/shopifycloud/checkout-web/assets/c1/71b60e0a.DfPLdYsH.js","/cdn/shopifycloud/checkout-web/assets/c1/6bfea526.BiTkHB9o.js","/cdn/shopifycloud/checkout-web/assets/c1/ac5a19ff.BsT-L1QA.js","/cdn/shopifycloud/checkout-web/assets/c1/598fef4e.jpLk7ufh.js","/cdn/shopifycloud/checkout-web/assets/c1/e77f7fe0.BJqC7Qgs.js","/cdn/shopifycloud/checkout-web/assets/c1/cc6ff67d.CZ3j9Gxk.js","/cdn/shopifycloud/checkout-web/assets/c1/bf513f9c.DxE_1kx0.js","/cdn/shopifycloud/checkout-web/assets/c1/dfca5da5.BAnMa568.js","/cdn/shopifycloud/checkout-web/assets/c1/dae24aab.CVNnVl1k.js","/cdn/shopifycloud/checkout-web/assets/c1/ddf59287.VO_keXSX.js","/cdn/shopifycloud/checkout-web/assets/c1/01973ac7.CVAr8Pej.js","/cdn/shopifycloud/checkout-web/assets/c1/58314944.B0jsjr69.js","/cdn/shopifycloud/checkout-web/assets/c1/945a08d6.xdF1UB1X.js","/cdn/shopifycloud/checkout-web/assets/c1/7bc8057b.B28gX89h.js","/cdn/shopifycloud/checkout-web/assets/c1/a25deb9a.CUZtBW-N.js","/cdn/shopifycloud/checkout-web/assets/c1/2b89a178.DPaX0GBX.js","/cdn/shopifycloud/checkout-web/assets/c1/b684bff6.B2KGfG3c.js","/cdn/shopifycloud/checkout-web/assets/c1/910cd6e2.dH9fdI52.js","/cdn/shopifycloud/checkout-web/assets/c1/347b440c.BduI4yZr.js","/cdn/shopifycloud/checkout-web/assets/c1/9ce08e25.BiKFZwVD.js","/cdn/shopifycloud/checkout-web/assets/c1/181d38d3.CLNFOKb-.js","/cdn/shopifycloud/checkout-web/assets/c1/792bb671.B3OvVnSg.js","/cdn/shopifycloud/checkout-web/assets/c1/9ca7d819.CdW8eEzr.js","/cdn/shopifycloud/checkout-web/assets/c1/f51e663e.BlZEXqdR.js","/cdn/shopifycloud/checkout-web/assets/c1/21cc90a2.DHzOO82q.js","/cdn/shopifycloud/checkout-web/assets/c1/64de7b49.DqdJl5li.js","/cdn/shopifycloud/checkout-web/assets/c1/ca0c3e72.D8mpF0ox.js","/cdn/shopifycloud/checkout-web/assets/c1/8e79be58.BnieBDnL.js","/cdn/shopifycloud/checkout-web/assets/c1/90e26f5f.CQTVbXU8.js","/cdn/shopifycloud/checkout-web/assets/c1/31cc568e.95lmLO5k.js","/cdn/shopifycloud/checkout-web/assets/c1/65f3d4da.Bb3QiqCm.js","/cdn/shopifycloud/checkout-web/assets/c1/ca5e9c49.BN_FThgm.js","/cdn/shopifycloud/checkout-web/assets/c1/f3e117aa.B-s5M24_.js","/cdn/shopifycloud/checkout-web/assets/c1/7aefefff.C1TUxG1O.js","/cdn/shopifycloud/checkout-web/assets/c1/b3389d5c.2aWeZ1D5.js","/cdn/shopifycloud/checkout-web/assets/c1/73a9b0a0.BhpXZgXg.js","/cdn/shopifycloud/checkout-web/assets/c1/25604ae0.56pfEpxV.js","/cdn/shopifycloud/checkout-web/assets/c1/dada7e07.DMPc6rKm.js","/cdn/shopifycloud/checkout-web/assets/c1/86720dbb.PUUWyC7P.js","/cdn/shopifycloud/checkout-web/assets/c1/f692f62f.DGKSLXXr.js","/cdn/shopifycloud/checkout-web/assets/c1/9babe369.SH-YgBx8.js","/cdn/shopifycloud/checkout-web/assets/c1/434e3b0a.oup8Ur0H.js","/cdn/shopifycloud/checkout-web/assets/c1/e0989459.3MVNiKY8.js","/cdn/shopifycloud/checkout-web/assets/c1/cdfd59e6.COPLdum1.js","/cdn/shopifycloud/checkout-web/assets/c1/fc21c11a.UcRxeNXj.js","/cdn/shopifycloud/checkout-web/assets/c1/e129c76e.DTjriAee.js","/cdn/shopifycloud/checkout-web/assets/c1/d4ea2faa.ChfKjLez.js","/cdn/shopifycloud/checkout-web/assets/c1/fe885b80.wv-bqZBc.js","/cdn/shopifycloud/checkout-web/assets/c1/f78726c8.B_yQ6cC4.js","/cdn/shopifycloud/checkout-web/assets/c1/e477f96c.lPemMKlK.js","/cdn/shopifycloud/checkout-web/assets/c1/d7065744.DH5rilol.js","/cdn/shopifycloud/checkout-web/assets/c1/7ee73f43.B_cT54pw.js","/cdn/shopifycloud/checkout-web/assets/c1/0c0ad074.DA-3zBKv.js","/cdn/shopifycloud/checkout-web/assets/c1/8fe56fc9.BwLCrTzJ.js","/cdn/shopifycloud/checkout-web/assets/c1/87bfafec.CxwEzGHg.js","/cdn/shopifycloud/checkout-web/assets/c1/051149c8.lHD9iIAq.js","/cdn/shopifycloud/checkout-web/assets/c1/d2e6a587.Q26QXgrg.js","/cdn/shopifycloud/checkout-web/assets/c1/c10167e6.B__oI2w3.js","/cdn/shopifycloud/checkout-web/assets/c1/b9c0319a.DcGEivT2.js","/cdn/shopifycloud/checkout-web/assets/c1/17e57de1.C4OivbHV.js"];
      var styles = ["/cdn/shopifycloud/checkout-web/assets/c1/assets/app.CcGlIMpn.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/wallet-prefilled-guest-return.BZwmSkmD.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/hydrate.DUY3Jbo2.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/OnePage.C_uC3EPz.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/VatNumberValidationField.CAYYnuvZ.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/ShopPayLogo.87JMHPUK.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/ShopPayVerificationTrigger.BnDF3H7t.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/BillingAddressForm.BdwN7V1K.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/PhoneField.uZEuHncj.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/Popover.Bi1nHaU-.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/Choice.CrYuHUmO.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/EmptyState.BEvzDDvy.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/TransitionHeight.CuRoM9zv.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/StickyPayButton.D-gNjNDa.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/Switch.BS8yVgoP.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/useShopPayProgressIntercepts.CIy8uDiZ.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/Tipping.BcTJoNaV.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/PaymentIcon.gzvCNwz_.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/PaymentLine.DT05kVlY.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/Section.CU18S7Ap.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/constants.xO_7ctnq.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/Middot.D7Ujmshx.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/EstimatedDeliveryContent.B_THySFF.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/ShippingMethods.DU0m5rdF.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/ShippingMethodSelector.B0hio2RO.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/SubscriptionPriceBreakdown.vTcdVGq4.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/BelowTheFoldContent.BKRoWsh4.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/RememberMeSection.JBO5WNhc.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/PaymentMethodProgressionHost.C0BOgdmL.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/RedirectionNotice.DgiInWJ-.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/PayButtonSection.CZuxzxFG.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/hooks.BDst-6PZ.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/useShopPayButtonClassName.D-F4uQ9M.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/MobileOrderSummary.BlloiNDx.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/PaymentOptionSelector.s-Kd_X2E.css"];
      var fontPreconnectUrls = [];
      var fontPrefetchUrls = [];
      var imgPrefetchUrls = ["https://cdn.shopify.com/s/files/1/0241/5532/4468/files/image-001_x320.png?v=1665225836"];

      function preconnect(url, callback) {
        var link = document.createElement('link');
        link.rel = 'dns-prefetch preconnect';
        link.href = url;
        link.crossOrigin = '';
        link.onload = link.onerror = callback;
        document.head.appendChild(link);
      }

      function preconnectAssets() {
        var resources = preconnectOrigins.concat(fontPreconnectUrls);
        var index = 0;
        (function next() {
          var res = resources[index++];
          if (res) preconnect(res, next);
        })();
      }

      function prefetch(url, as, callback) {
        var link = document.createElement('link');
        if (link.relList.supports('prefetch')) {
          link.rel = 'prefetch';
          link.fetchPriority = 'low';
          link.as = as;
          if (as === 'font') link.type = 'font/woff2';
          link.href = url;
          link.crossOrigin = '';
          link.onload = link.onerror = callback;
          document.head.appendChild(link);
        } else {
          var xhr = new XMLHttpRequest();
          xhr.open('GET', url, true);
          xhr.onloadend = callback;
          xhr.send();
        }
      }

      function prefetchAssets() {
        var resources = [].concat(
          scripts.map(function(url) { return [url, 'script']; }),
          styles.map(function(url) { return [url, 'style']; }),
          fontPrefetchUrls.map(function(url) { return [url, 'font']; }),
          imgPrefetchUrls.map(function(url) { return [url, 'image']; })
        );
        var index = 0;
        function run() {
          var res = resources[index++];
          if (res) prefetch(res[0], res[1], next);
        }
        var next = (self.requestIdleCallback || setTimeout).bind(self, run);
        next();
      }

      function onLoaded() {
        try {
          if (parseFloat(navigator.connection.effectiveType) > 2 && !navigator.connection.saveData) {
            preconnectAssets();
            prefetchAssets();
          }
        } catch (e) {}
      }

      if (document.readyState === 'complete') {
        onLoaded();
      } else {
        addEventListener('load', onLoaded);
      }
    })();
  