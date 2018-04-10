const app = {
    state: {
        filterData: {
            categories: 'all',
            area: 'all',
            seat: 'all'
        }
    },
    mutations: {
        CHANGE_FILTER: (state, data) => {
            state.filterData = Object.assign(data)
        }
    },
    actions: {
        changeFilter: ({ commit }, data) => {
            // console.log(111, data)
            commit('CHANGE_FILTER', data)
        }
    }
}

export default app