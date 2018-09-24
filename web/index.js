import './index.scss'
import { render } from 'mustache'
import Sortable from 'sortablejs'

// Namespace for some global references.
const App = {
  sortableList: null
}

/**
 * This will fetch the items from the API and render them in the page.
 * Also it will make the items sortable.
 */
const loadItems = async () => {
  const response = await fetch('/items')
  const { count, items } = await response.json()
  renderItems(items)
  renderCount(count)
  initializeSortable(itemList)
}

const renderItems = items => {
  itemList.innerHTML = items
    .map(item => render(itemTemplate.innerHTML, item))
    .join('')
}

const renderCount = count => {
  itemCount.innerHTML = `${count} items`
}

const initializeSortable = itemList => {
  // I have to destroy the sortable list in case the item was re-rendered.
  if (App.sortableList) {
    App.sortableList.destroy()
  }

  App.sortableList = Sortable.create(itemList, {
    onEnd: () => {
      fetch('/items/update-order', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify(App.sortableList.toArray())
      })
    }
  })
}

document.addEventListener('DOMContentLoaded', loadItems)
