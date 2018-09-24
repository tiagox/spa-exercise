import './index.scss'
import { render } from 'mustache'
import Sortable from 'sortablejs'

// Namespace for some global references.
const App = {
  items: [],
  sortableList: null
}

/**
 * This will fetch the items from the API and render them in the page.
 * Also it will make the items sortable.
 */
const loadItems = async () => {
  const response = await fetch('/items')
  const { items } = await response.json()
  App.items = items
  renderItems()
  renderCount()
  initializeSortable()
}

const renderItems = () => {
  // Removing all the elements in the list.
  // This is something that could be improved.
  // In case the list grows considerably
  ;[...itemList.children].forEach(removeItemFromDOM)

  itemList.innerHTML = App.items
    .map(item => render(itemTemplate.innerHTML, item))
    .join('')

  // Attach the event listener for the actions of each item
  ;[...itemList.children].forEach(item => {
    item.querySelector('.edit').addEventListener('click', editItemCallback)
    item.querySelector('.delete').addEventListener('click', deleteItemCallback)
  })

  renderCount()
}

const editItemCallback = ({ target }) => {
  console.log('Edit', target.dataset.id)
}

const deleteItemCallback = async ({ target }) => {
  const itemId = target.dataset.id
  const response = await fetch(`/items/${itemId}/delete`, {
    method: 'DELETE'
  })
  const { success } = await response.json()

  if (success) {
    App.items = App.items.filter(item => item._id !== itemId)
    renderItems()
    updateOrder()
  }
}

const removeItemFromDOM = item => {
  item.querySelector('.edit').removeEventListener('click', editItemCallback)
  item.querySelector('.delete').removeEventListener('click', deleteItemCallback)
  item.remove()
}

const renderCount = () => {
  itemCount.innerHTML = `${App.items.length} items`
}

const initializeSortable = itemList => {
  // I have to destroy the sortable list in case the item was re-rendered.
  if (App.sortableList) {
    App.sortableList.destroy()
  }

  App.sortableList = Sortable.create(itemList, { onEnd: updateOrder })
}

const updateOrder = async () => {
  const response = await fetch('/items/update-order', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(App.sortableList.toArray())
  })
  const { success } = await response.json()

  if (success) {
    ;[...itemList.children].forEach((item, index) => {
      item.dataset.id = index
    })
  }
}

document.addEventListener('DOMContentLoaded', loadItems)
