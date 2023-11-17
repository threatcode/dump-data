;
(function (window) {
    function scrollTo(option) {
        var i, elem;
        var setting = option || {selector: '.scrolltop'};
        if (!setting.selector)
            return false;
        var elements = document.querySelectorAll(setting.selector);
        for (i = 0; i < elements.length; i++) {
            elem = elements[i];
            if (elem.getAttribute('href')) {
                elem.addEventListener('click', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    var offset = this.getAttribute('offset') || 0;
                    var startY = self.pageYOffset || document.body.scrollTop || document.documentElement.scrollTop || 0;
                    var stopY = getElementYPos(this.getAttribute('href')) - parseInt(offset);
                    var distance = stopY > startY ? stopY - startY : startY - stopY;
                    if (distance < 100) {
                        scrollTo(0, stopY);
                        return;
                    }
                    var speed = Math.round(distance / 100);
                    if (speed >= 20)
                        speed = 20;
                    var step = Math.round(distance / 25);
                    var leapY = stopY > startY ? startY + step : startY - step;
                    var timer = 0;
                    if (stopY > startY) {
                        for (var i = startY; i < stopY; i += step) {
                            setTimeout("window.scrollTo(0, " + leapY + ")", timer * speed);
                            leapY += step;
                            if (leapY > stopY)
                                leapY = stopY;
                            timer++;
                        }
                        return;
                    }
                    for (var i = startY; i > stopY; i -= step) {
                        setTimeout("window.scrollTo(0, " + leapY + ")", timer * speed);
                        leapY -= step;
                        if (leapY < stopY)
                            leapY = stopY;
                        timer++;
                    }
                });
            }
        }
        function getElementYPos(elmId) {
            elmId = elmId.replace('#', '');
            if (!elmId)
                return 0;
            var elm = document.getElementById(elmId);
            var y = elm.offsetTop;
            var node = elm;
            while (node.offsetParent && node.offsetParent != document.body) {
                node = node.offsetParent;
                y += node.offsetTop;
            }
            return y;
        }
    }
    scrollTo({
        selector: '.scrolltop'
    });
})(window);