/**
 * @file
 * Fork of zurb/twentytwenty library.
 *
 * Makes Before/After labels customizable.
 * Check https://github.com/zurb/twentytwenty for the original library.
 */

(function ($) {
  'use strict';

  $.fn.twentytwenty = function (options) {
    options = $.extend({
      default_offset_pct: 0.5,
      orientation: 'horizontal'
    }, options);

    return this.each(function () {
      var container = $(this);
      var sliderPct = options.default_offset_pct;
      var sliderOrientation = options.orientation;
      var beforeDirection = (sliderOrientation === 'vertical') ? 'down' : 'left';
      var afterDirection = (sliderOrientation === 'vertical') ? 'up' : 'right';
      var overlay = container.find('.twentytwenty-overlay');
      var beforeImg = container.find('img:first');
      var afterImg = container.find('img:last');
      var beforeLabel = beforeImg.attr('data-label') || 'Before';
      var afterLabel = afterImg.attr('data-label') || 'After';
      var offsetX = 0;
      var offsetY = 0;
      var imgWidth = 0;
      var imgHeight = 0;

      container.wrap($('<div>', {
        class: 'twentytwenty-wrapper twentytwenty-' + sliderOrientation
      }));
      beforeImg.addClass('twentytwenty-before');
      afterImg.addClass('twentytwenty-after');

      // Overlay with before and after divs.
      if (overlay.length < 1) {
        overlay = $('<div>', {class: 'twentytwenty-overlay'});
        container.append(overlay);
      }

      if (overlay.children('.twentytwenty-before-label').length < 1) {
        overlay.append($('<div>', {
          'class': 'twentytwenty-before-label',
          'data-label': beforeLabel
        }));
      }
      if (overlay.children('.twentytwenty-after-label').length < 1) {
        overlay.append($('<div>', {
          'class': 'twentytwenty-after-label',
          'data-label': afterLabel
        }));
      }

      // Handle.
      var slider = $('<div>', {class: 'twentytwenty-handle'});
      container.append(slider);
      slider.append('<span class="twentytwenty-' + beforeDirection + '-arrow"></span>');
      slider.append('<span class="twentytwenty-' + afterDirection + '-arrow"></span>');

      container.addClass('twentytwenty-container');

      var calcOffset = function (dimensionPct) {
        var w = beforeImg.width();
        var h = beforeImg.height();
        return {
          w: w + 'px',
          h: h + 'px',
          cw: (dimensionPct * w) + 'px',
          ch: (dimensionPct * h) + 'px'
        };
      };

      var adjustContainer = function (offset) {
        if (sliderOrientation === 'vertical') {
          beforeImg.css('clip', 'rect(0,' + offset.w + ',' + offset.ch + ',0)');
        }
        else {
          beforeImg.css('clip', 'rect(0,' + offset.cw + ',' + offset.h + ',0)');
        }
        container.css('height', offset.h);
      };

      var adjustSlider = function (pct) {
        var offset = calcOffset(pct);
        slider.css(
          (sliderOrientation === 'vertical') ? 'top' : 'left',
          (sliderOrientation === 'vertical') ? offset.ch : offset.cw
        );
        adjustContainer(offset);
      };

      $(window).on('resize.twentytwenty', function () {
        adjustSlider(sliderPct);
      });

      slider.on('movestart', function (e) {
        if ((((e.distX > e.distY && e.distX < -e.distY) || (e.distX < e.distY && e.distX > -e.distY)) && sliderOrientation !== 'vertical') ||
          (((e.distX < e.distY && e.distX < -e.distY) || (e.distX > e.distY && e.distX > -e.distY)) && sliderOrientation === 'vertical')) {
          e.preventDefault();
        }
        container.addClass('active');
        offsetX = container.offset().left;
        offsetY = container.offset().top;
        imgWidth = beforeImg.width();
        imgHeight = beforeImg.height();
      });

      slider.on('moveend', function () {
        container.removeClass('active');
      });

      slider.on('move', function (event) {
        if (container.hasClass('active')) {
          sliderPct = (sliderOrientation === 'vertical') ?
            (event.pageY - offsetY) / imgHeight : (event.pageX - offsetX) / imgWidth;
          if (sliderPct < 0) {
            sliderPct = 0;
          }
          if (sliderPct > 1) {
            sliderPct = 1;
          }
          adjustSlider(sliderPct);
        }
      });

      container.find('img').on('mousedown', function (event) {
        event.preventDefault();
      });

      $(window).trigger('resize.twentytwenty');
    });
  };

})(jQuery);
