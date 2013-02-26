;(function ($, window, undefined) {
    'use strict';

    $.translate = {};

    var progressIndicator = $('<div class="translating">Translating</div>'),
        onComplete = function() {},
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
                    $(this).html(translatedText[i]);
                });
            } else if ($element.size() > 0) {
                $element.each(function(i) {
                    $(this).html(translatedText[i]);
                });
            } else {
                $element.html(translatedText[0]);
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
            $element.prev().remove();
        },
        setDefaults : function() {
            if (typeof $.translate.progressIndicator !== 'undefined') {
                if (typeof $.translate.progressIndicator === 'object') {
                    progressIndicator = $.translate.progressIndicator;
                } else {
                    progressIndicator = $($.translate.progressIndicator);
                }
                delete $.translate.progressIndicator;
            }

            if (typeof $.translate.onComplete !== 'undefined') {
                onComplete = $.translate.onComplete;
                delete $.translate.onComplete;
            }
        }
    };

    $.fn.translate = function(options) {
        if (!this.length) {
            $.error("Element not found: '" + this.selector + "'");
        }

        $.translate = $.extend(options, $.translate);

        methods.setDefaults();

        var $this = this,
            toTranslate = methods.collect(this)
            ;

        methods.showProgress($this);

        return $.get(
            'https://www.googleapis.com/language/translate/v2?q=' + toTranslate.join('&q='),
            $.translate
        ).done(function(res) {
            methods.removeProgress($this);
            methods.done($this, methods.parseResonse(res));
            onComplete();
        }).fail(function(res) {
            methods.removeProgress($this);
            $.error(res.responseText);
        });
    };

}(jQuery, window));
