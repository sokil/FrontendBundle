var PaginationView = Backbone.View.extend({

    events: {
        'click [data-page]': 'pageClickEventHandler',
        'click [data-prev]': 'prevPageClickEventHandler',
        'click [data-next]': 'nextPageClickEventHandler'
    },

    totalPages: 0,

    initialize: function(options) {
        // specify default values
        this.options = $.extend({
            // total numner of items
            itemCount: null,
            // items count per page
            itemCountPerPage: 10,
            // number of current page
            currentPage: 1,
            // number of page buttons
            pageRange: 10,
            // change event handler
            change: null
        }, options);

        // calculate total pages
        this.totalPages = Math.ceil(this.options.itemCount / this.options.itemCountPerPage);

        // register events
        if (this.options.change) {
            this.on('change', this.options.change);
        }
    },

    pageClickEventHandler: function(e) {
        var $pageButton = $(e.currentTarget);
        // set page
        this.setCurrentPage($pageButton.data('page'));
        return false;
    },

    prevPageClickEventHandler: function() {
        this.setCurrentPage(this.options.currentPage - 1);
        return false;
    },

    nextPageClickEventHandler: function() {
        this.setCurrentPage(this.options.currentPage + 1);
        return false;
    },

    setCurrentPage: function(page) {
        // check if page is valid
        if (page > this.totalPages) {
            throw Error('Page greater then total number of pages');
        }
        if (page < 1) {
            throw Error('Page must be greater than 1');
        }

        // set current page
        this.options.currentPage = page;
        
        // send change event
        this.trigger('change', {
            page: this.options.currentPage
        });
    },
    
    render: function() {
        // get start page
        var startPage = this.options.currentPage - Math.floor(this.options.pageRange / 2);
        if (startPage < 1) {
            startPage = 1;
        }

        // get end page
        var endPage = startPage + this.options.pageRange;
        if (endPage > this.totalPages) {
            endPage = this.totalPages;
        }

        // render
        this.$el.html(app.render('Pagination', {
            startPage: startPage,
            endPage: endPage,
            currentPage: this.options.currentPage
        }));

        // remove previous active class
        this.$el.find('li').removeClass('active');

        // highlight current page
        this.$el.find('[data-page=' + this.options.currentPage + ']')
            .closest('li')
            .addClass('active');

        // disable prev
        if (this.options.currentPage === 1) {
            this.$el.find('[data-prev]').parent('li').addClass('disabled');
        } else {
            this.$el.find('[data-prev]').parent('li').removeClass('disabled');
        }

        // disable next
        if (this.options.currentPage === this.totalPages) {
            this.$el.find('[data-next]').parent('li').addClass('disabled');
        } else {
            this.$el.find('[data-next]').parent('li').removeClass('disabled');
        }
    }
});