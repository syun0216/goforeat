const getter = {
    area: state => state.app.filterData.area,
    seat: state => state.app.filterData.seat,
    categories: state => state.app.filterData.categories
}

export default getter