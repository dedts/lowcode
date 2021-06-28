const idb = {
  openDB(name, version = 1) {
    const request = window.indexedDB.open(name, version)

    return new Promise((resolve, reject) => {
      request.onerror = (e) => {
        reject(e.currentTarget.error.message)
      }
      request.onsuccess = (e) => {
        resolve(e.target.result)
      }
      request.onupgradeneeded = (e) => {
        const db = e.target.result
        if (!db.objectStoreNames.contains('history')) {
          const store = db.createObjectStore('history', { keyPath: 'id' })
        }
      }
    })
  },
  name: 'form-making',
  cursor: 0
}

export default {
  clear() {
    return new Promise((resolve, reject) => {
      idb.openDB(idb.name).then((db) => {
        const trans = db.transaction(['history'], 'readwrite')
        const historyStore = trans.objectStore('history')

        historyStore.clear()

        trans.oncomplete = (e) => {
          idb.cursor = 0
          resolve()
        }
      })
    })
  },
  updateLatest(data, selectedKey) {
    return new Promise((resolve, reject) => {
      idb.openDB(idb.name).then((db) => {
        const trans = db.transaction(['history'], 'readwrite')
        const historyStore = trans.objectStore('history')

        historyStore.put({
          id: idb.cursor,
          data: data,
          selected: selectedKey
        })

        trans.oncomplete = (e) => {
          resolve()
        }
      })
    })
  },
  add(data, selectedKey) {
    return new Promise((resolve, reject) => {
      idb.openDB(idb.name).then((db) => {
        const trans = db.transaction(['history'], 'readwrite')
        const historyStore = trans.objectStore('history')

        const id = idb.cursor + 1

        const historyList = []

        historyStore.openCursor().onsuccess = (e) => {
          const cursor = e.target.result
          if (cursor) {
            historyList.push(cursor.value)
            cursor.continue()
          } else {
            for (let i = 0; i < historyList.length; i++) {
              if (historyList[i].id > idb.cursor) {
                historyStore.delete(historyList[i].id)
              }
            }

            historyStore.add({
              id: id,
              data: data,
              selected: selectedKey
            })
          }
        }

        trans.oncomplete = (e) => {
          idb.cursor = id
          resolve()
        }
      })
    })
  },
  undo() {
    return new Promise((resolve, reject) => {
      idb.openDB(idb.name).then((db) => {
        const trans = db.transaction(['history'], 'readwrite')
        const historyStore = trans.objectStore('history')

        console.log(idb.cursor, historyStore.count())

        let cursor = 0, data = {
            list: [],
            config: {
              labelWidth: 100,
              labelPosition: 'right',
              size: 'small',
              customClass: '',
              ui: 'element',
              layout: 'horizontal',
              labelCol: 3
            }
          }, undo = false, redo = true, key = ''

        if (idb.cursor > 1) {
          const request = historyStore.get(idb.cursor - 1)

          request.onsuccess = (e) => {
            data = request.result.data

            key = request.result.selected

            undo = true
          }
        }

        trans.oncomplete = (e) => {
          idb.cursor = idb.cursor - 1
          resolve({ data, key, undo, redo })
        }
      })
    })
  },
  redo() {
    return new Promise((resolve, reject) => {
      idb.openDB(idb.name).then((db) => {
        const trans = db.transaction(['history'], 'readwrite')
        const historyStore = trans.objectStore('history')

        console.log(idb.cursor)

        let cursor = 0, data = {}, undo = true, redo = false, key = ''

        const countRequest = historyStore.count()

        countRequest.onsuccess = () => {
          const count = countRequest.result

          if (idb.cursor < count) {
            const request = historyStore.get(idb.cursor + 1)

            request.onsuccess = (e) => {
              data = request.result.data

              key = request.result.selected

              redo = idb.cursor + 1 != count
            }
          }
        }

        trans.oncomplete = (e) => {
          idb.cursor = idb.cursor + 1
          resolve({ data, key, undo, redo })
        }
      })
    })
  }
}
