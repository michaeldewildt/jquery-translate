describe("translate", function() {
    var done;

    beforeEach(function() {
        jasmine.Ajax.useMock();

        $.translate.key = 'myApiKey';
    });

    it("should post a request from a single element", function() {
        $('<p>Awesome!<p>').translate({
            source: 'en',
            target: 'de'
        });

        request = mostRecentAjaxRequest();
        expect(request.url).toBe('https://www.googleapis.com/language/translate/v2?q=Awesome!&source=en&target=de&key=myApiKey');
        expect(request.method).toBe('GET');
    });

    it("should post a request from multipe elements", function() {
        $('<div><p>One</p><p>Two</p></div>').translate({
            source: 'en',
            target: 'de'
        });

        request = mostRecentAjaxRequest();
        expect(request.url).toBe('https://www.googleapis.com/language/translate/v2?q=One&q=Two&source=en&target=de&key=myApiKey');
        expect(request.method).toBe('GET');
    });


    it("should update the div with translated text", function() {
        beforeEach(function() {
            spyOn(this, 'done');
        });

        var html = $('<div>Hello World!</div>');

        html.translate({
            source: 'en',
            target: 'de'
        });

        mostRecentAjaxRequest().response({
            status: 200,
            responseText: '{"data": {"translations": [{"translatedText": "Hallo Welt!"}]}}'
        });

        expect(html.text()).toBe('Hallo Welt!');
    });

});