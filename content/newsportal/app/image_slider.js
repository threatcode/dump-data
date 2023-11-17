

;(function($) {

    $.fn.imageSlider = function(options) {

        var plugin = this,
            settings = {},
            slider = $(this),
            slides = slider.children(),
            windowSize = $(window).width();

        var init = function() {

            settings = $.extend({}, $.fn.imageSlider.defaults, options);

            var numberOfImageToShow = windowSize < (150*(settings.numberOfImageToShow+3)+50) ? 3 : settings.numberOfImageToShow;
            nav(numberOfImageToShow);

            $(window).resize(function() {
                var currentWindowSize = $(window).width();
                var numberOfImageToShowOnResize = ((currentWindowSize/windowSize)*100) < 70 ? 3 : settings.numberOfImageToShow;
                nav(numberOfImageToShowOnResize);
            });

            return plugin;
        };



        var nav = function (numberOfImageToShow) {

            // set the outer div width according to the number of image to show
            slider.width(150*numberOfImageToShow+50);

            // put unique ID to each child divs
            var idCount = 1;
            slides.each(function() {
                $(this).attr('id', settings.identifier+'-imgDiv-'+idCount);
                idCount++;
            });

            // generate nav controls
            var leftNav = '',
                rightNav = '';
            if(settings.navLeftId !== '' && settings.navRightId !== '') {

                leftNav = $('#'+settings.navLeftId);
                rightNav = $('#'+settings.navRightId);
            }
            else {

                leftNav = $('<button class="' + settings.identifier + '-slider-nav-left">Left Arrow</button>'),
                rightNav = $('<button class="' + settings.identifier + '-slider-nav-right">Right Arrow</button>');

                slider.prepend(leftNav);
                slider.prepend(rightNav);
            }

            // image move and other tasks
            var current = 0;
            for(var i=1; i<=numberOfImageToShow; i++) {
                $('#'+settings.identifier+'-imgDiv-'+i).show();
                current = i-1;
            }

            // left arrow click
            leftNav.unbind().click(function() {
                var toHide = current-(numberOfImageToShow-2);
                var toShow = current+2;
                if(current < (slides.length-1)) {
                    $('#'+settings.identifier+'-imgDiv-'+toHide).hide(500);
                    $('#'+settings.identifier+'-imgDiv-'+toShow).show(500);
                    current += 1;
                }
            });

            // right arrow click
            rightNav.unbind().click(function() {
                var toHide = current+1;
                var toShow = current-(numberOfImageToShow-1);
                if(current > (numberOfImageToShow-1)) {
                    $('#'+settings.identifier+'-imgDiv-'+toHide).hide(500);
                    $('#'+settings.identifier+'-imgDiv-'+toShow).show(500);
                    current -= 1;
                }
            });
        }

        return init();
    };

    $.fn.imageSlider.defaults = {

        numberOfImageToShow: 3,
        identifier: 'slider',
        navLeftId: '',
        navRightId: ''
    };

})(jQuery);
