import _ from 'lodash'

export const CloneLayout = (data) => {
  if (data.type === 'grid') {
    const key = Math.random().toString(36).slice(-8)
    return {
      ...data,
      key,
      model: data.type + '_' + key,
      columns: data.columns.map(item => {
        return {
          ...item,
          list: item.list.map(colItem => {
            return CloneLayout(colItem)
          })
        }
      })
    }
  } else if (data.type === 'tabs') {
    const key = Math.random().toString(36).slice(-8)
    return {
      ...data,
      key,
      model: data.type + '_' + key,
      tabs: data.tabs.map(item => {
        return {
          ...item,
          list: item.list.map(tabItem => {
            return CloneLayout(tabItem)
          })
        }
      })
    }
  } else if (data.type === 'table') {
    const key = Math.random().toString(36).slice(-8)
    return {
      ...data,
      key,
      model: data.type + '_' + key,
      tableColumns: data.tableColumns.map(item => {
        return CloneLayout(item)
      })
    }
  } else {
    const key = Math.random().toString(36).slice(-8)
    return {
      ...data,
      key,
      model: data.type + '_' + key
    }
  }
}
