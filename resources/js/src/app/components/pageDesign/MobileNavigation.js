Vue.component("mobile-navigation", {

    props: [
        "template",
        "categoryTreeRaw"
    ],

    data()
    {
        return {
            dataContainer1: [],
            dataContainer2: [],
            useFirstContainer: false,
            categoryTree: [],
            breads: []
        };
    },

    created()
    {
        this.$options.template = this.template;

        this.buildTree(this.categoryTreeRaw);

        this.dataContainer1 = this.categoryTree;
    },

    ready()
    {
        // REFACTOR!!!
        /*
            - setze das aktuelle auf aktiv
            - trigger menu-activated auf das aktuelle
        */
        // ./REFACTOR
    },

    methods: {
        buildTree(currentArray, parent)
        {
            for (const category of currentArray)
            {
                const newCategory =
                    {
                        id: category.id,
                        level: category.level,
                        name: category.details[0].name,
                        url: parent ? parent.url + "/" + category.details[0].nameUrl : "/" + category.details[0].nameUrl,
                        parent: parent,
                        children: []
                    };

                if (parent)
                {
                    parent.children.push(newCategory);
                }
                else
                {
                    this.categoryTree.push(newCategory);
                }

                if (category.children)
                {
                    this.buildTree(category.children, newCategory);
                }
            }
        },

        navigateTo(children, back)
        {
            back = !!back;

            if (this.useFirstContainer)
            {
                this.dataContainer1 = children;

                $("#menu-2").trigger("menu-deactivated", {back: back});
                $("#menu-1").trigger("menu-activated", {back: back});
            }
            else
            {
                this.dataContainer2 = children;

                $("#menu-1").trigger("menu-deactivated", {back: back});
                $("#menu-2").trigger("menu-activated", {back: back});
            }

            this.useFirstContainer = !this.useFirstContainer;
            this.buildBreads();
        },

        buildBreads()
        {
            this.breads = [];

            const breads = [];
            let root = this.useFirstContainer ? this.dataContainer2[0] : this.dataContainer1[0];

            while (root.parent)
            {
                breads.unshift(
                    {
                        name: root.parent.name,
                        layer: root.parent ? root.parent.children : this.categoryTree
                    });

                root = root.parent;
            }

            this.breads = breads;
        },

        closeNavigation()
        {
            $(".mobile-navigation").removeClass("open");
            $("body").removeClass("menu-is-visible");
        }
    },

    directives:
    {
        menu: {
            bind()
            {
				// add "activated" classes when menu is activated
                $(this.el).on("menu-activated", (event, params) =>
                {
                    $(event.target).addClass("menu-active");
                    $(event.target).addClass(params.back ? "animate-inFromLeft" : "animate-inFromRight");
                });
				// add "deactivated" classes when menu is deactivated
                $(this.el).on("menu-deactivated", (event, params) =>
                {
                    $(event.target).removeClass("menu-active");
                    $(event.target).addClass(params.back ? "animate-outToRight" : "animate-outToLeft");
                });
				// this removes the animation class automatically after the animation has completed
                $(this.el).on("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd", () =>
                {
                    $(".mainmenu").removeClass((index, className) =>
                    {
                        return (className.match(/(^|\s)animate-\S+/g) || []).join(" ");
                    });
                });
            }
        }
    }
});