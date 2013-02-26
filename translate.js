;(function ($, window, undefined) {
    'use strict';

    $.translate = {};

    var methods = {
        collect : function($element) {
            var $children = $element.children(),
                text = []
                ;

            if ($children.size() > 0) {

                $children.each(function() {
                    var $this = $(this);

                    text.push($this.text().trim());
                    methods.showProgress($this);
                });
            } else {
                text.push($element.text().trim());
                methods.showProgress($element);
            }

            return text;
        },
        done : function($element, translatedText) {
            var $children = $element.children();

            if ($children.size() > 0) {
                $children.each(function(i) {
                    $(this).text(translatedText[i]);
                });
            } else {
                $element.text(translatedText[0]);
            }
        },
        parseResonse: function(response) {
            var
                text = [],
                translations = response.data.translations
                ;

            for (var i = 0; i < translations.length; i++) {
                text.push(translations[i].translatedText);
            }

            return text;
        },
        showProgress : function($element) {
            $element.text('Translating...');
        }
    };

    $.fn.translate = function(options) {
        if (!this.length) {
            $.error("Element not found: '" + this.selector + "'");
        }

        $.translate = $.extend(options, $.translate);

        var $this = this,
            toTranslate = methods.collect(this)
            ;

        return $.get(
            'https://www.googleapis.com/language/translate/v2?q=' + toTranslate.join('&q='),
            $.translate
        ).done(function(res) {
            methods.done($this, methods.parseResonse(res));
        }).fail(function(res) {
            methods.done($this, toTranslate);
            $.error(res.responseText);
        });
    };

}(jQuery, window));
