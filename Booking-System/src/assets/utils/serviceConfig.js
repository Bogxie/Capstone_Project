export const service_config = {
    "Golden Hour": {
        label: "Type of Package",
        options: [
            { value: "GH1", label: "Package 1" },
            { value: "GH2", label: "Package 2" },
        ],
        packages: [
            { name: "Package 1", price: "₱5,000", details: "3-hour photo & video coverage" },
            { name: "Package 2", price: "₱10,000", details: "6-hour coverage + same day edit" },
        ],
        theme: {
            color: "header-golden",
        }
    },
    "Snoop Dough": {
        label: "Type of Package",
        options: [
            { value: "SD1", label: "Package 1" },
            { value: "SD2", label: "Package 2" },
        ],
        packages: [
            { name: "Package 1", price: "₱500", details: "50 pcs plain pandesal" },
            { name: "Package 2", price: "₱900", details: "100 pcs assorted flavors" },
        ],
        theme: {
            color: "header-snoop",
        }
    },
    "Rental Projector": {
        label: "Type of Projector",
        options: [
            { value: "Project1", label: "Projector 1" },
            { value: "Project2", label: "Projector 2" },
        ],
        packages: [
            { name: "Projector 1", price: "₱1,500", details: "Full HD 1080p, up to 8 hours" },
            { name: "Projector 2", price: "₱2,500", details: "4K Ultra HD, up to 12 hours" },
        ],
        theme: {
            color: "header-projector",
        }
    },
}