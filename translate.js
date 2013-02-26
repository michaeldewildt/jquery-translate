;(function ($, window, undefined) {
    'use strict';

    $.translate = {};

    var progressIndicator = $('<div class="translating">Translating</div>'),
        methods = {
        collect : function($element) {
            var $children = $element.children(),
                text = []
                ;

            if ($children.size() > 0) {
                $children.each(function() {
                    var $this = $(this);

                    text.push(encodeURIComponent($this.text().trim()));
                });
            } else {
                text.push(encodeURIComponent($element.text().trim()));
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
            progressIndicator.insertBefore($element);
        },
        removeProgress : function($element) {
            progressIndicator.remove();
        }
    };

    $.fn.translate = function(options) {
        if (!this.length) {
            $.error("Element not found: '" + this.selector + "'");
        }

        $.translate = $.extend(options, $.translate);

        if (typeof $.translate.progressIndicator !== 'undefined') {
            if (typeof $.translate.progressIndicator === 'object') {
                progressIndicator = $.translate.progressIndicator;
            } else {
                progressIndicator = $($.translate.progressIndicator);
            }
            delete $.translate.progressIndicator;
        }

        var $this = this,
            toTranslate = methods.collect(this)
            ;

        methods.showProgress($this);

        return $.get(
            'https://www.googleapis.com/language/translate/v2?q=' + toTranslate.join('&q='),
            $.translate
        ).done(function(res) {
            methods.done($this, methods.parseResonse(res));
        }).fail(function(res) {
            $.error(res.responseText);
        }).always(function() {
            methods.removeProgress($this);
        });
    };

}(jQuery, window));
