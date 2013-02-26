describe("translating", function() {

    beforeEach(function() {
        jasmine.Ajax.useMock();

        $.translate.key = 'myApiKey';
    });

    describe("a single element with text in it", function() {

        it("should post a valid request", function() {
            var
                html = $('<div><div class="a"><p>Awesome!</p></div></div>'),
                element = html.find('.a')
                ;

            element.translate({
                source: 'en',
                target: 'de'
            });

            expect(element.prev().text()).toEqual('Translating');

            request = mostRecentAjaxRequest();
            expect(request.url).toBe('https://www.googleapis.com/language/translate/v2?q=Awesome!&source=en&target=de&key=myApiKey');
            expect(request.method).toBe('GET');
        });

        it("should encode request params correctly", function() {
            var
                html = $('<div><div class="a"><p>/ ? : @ & = + $ #</p></div></div>'),
                element = html.find('.a')
                ;

            element.translate({
                source: 'en',
                target: 'de'
            });

            expect(element.prev().text()).toEqual('Translating');

            request = mostRecentAjaxRequest();
            expect(request.url).toBe('https://www.googleapis.com/language/translate/v2?q=%2F%20%3F%20%3A%20%40%20%26%20%3D%20%2B%20%24%20%23&source=en&target=de&key=myApiKey');
            expect(request.method).toBe('GET');
        });

    });

    describe("miltiple elements with text in them", function() {

        it("should post a valid request", function() {
            var
                html = $('<div><div class="a"><p>One</p><p>Two</p></div><div>'),
                element = html.find('.a')
                ;

            element.translate({
                source: 'en',
                target: 'de'
            });

            expect(element.prev().text()).toEqual('Translating');

            request = mostRecentAjaxRequest();
            expect(request.url).toBe('https://www.googleapis.com/language/translate/v2?q=One&q=Two&source=en&target=de&key=myApiKey');
            expect(request.method).toBe('GET');
        });

        it("should encode request params correctly", function() {
            var
                html = $('<div><div class="a"><p>/ ? : @ &</p><p>= + $ #<p></div></div>');
                element = html.find('.a')
                ;

            element.translate({
                source: 'en',
                target: 'de'
            });

            expect(element.prev().text()).toEqual('Translating');

            request = mostRecentAjaxRequest();
            expect(request.url).toBe('https://www.googleapis.com/language/translate/v2?q=%2F%20%3F%20%3A%20%40%20%26&q=%3D%20%2B%20%24%20%23&q=&source=en&target=de&key=myApiKey');
            expect(request.method).toBe('GET');
        });
    });

    describe("on success", function() {

        it("it should update the div with translated text", function() {
            var
                html = $('<div><div class="a">Hello</div> <div class="a">World!</div></div>');
                element = html.find('.a')
                ;

            element.translate({
                source: 'en',
                target: 'de'
            });

            expect(html.find('.translating').size()).toEqual(2);

            mostRecentAjaxRequest().response({
                status: 200,
                responseText: '{"data": {"translations": [{"translatedText": "Hallo"},{"translatedText": "Welt!"}]}}'
            });

            expect(html.find('.translating').size()).toEqual(0);
            expect(html.text()).toBe('Hallo Welt!');
        });

        it("it should show and remove a custom progress indicator jquery object", function() {
            var
                html = $('<div><div class="a">Hello World!</div></div>');
                element = html.find('.a')
                ;

            element.translate({
                source: 'en',
                target: 'de',
                progressIndicator: $('<div>MyProgressIndicator</div>')
            });

            expect(element.prev().text()).toEqual('MyProgressIndicator');

            mostRecentAjaxRequest().response({
                status: 200,
                responseText: '{"data": {"translations": [{"translatedText": "Hallo Welt!"}]}}'
            });

            expect(html.text()).toBe('Hallo Welt!');
        });

        it("it should show and remove a custom progress indicator html", function() {
            var
                html = $('<div><div class="a">Hello World!</div></div>');
                element = html.find('.a')
                ;

            element.translate({
                source: 'en',
                target: 'de',
                progressIndicator: '<div>MyProgressIndicator</div>'
            });

            expect(element.prev().text()).toEqual('MyProgressIndicator');

            mostRecentAjaxRequest().response({
                status: 200,
                responseText: '{"data": {"translations": [{"translatedText": "Hallo Welt!"}]}}'
            });

            expect(html.text()).toBe('Hallo Welt!');
        });

    });

});