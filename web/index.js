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
  ;[...itemList.children].forEach(item => {
    item.querySelector('.edit').addEventListener('click', editItemCallback)
    item.querySelector('.delete').addEventListener('click', deleteItemCallback)
  })
}

const editItemCallback = ({ target }) => {
  console.log('Edit', target.dataset.id)
}

const deleteItemCallback = async ({ target }) => {
  const response = await fetch(`/items/${target.dataset.id}/delete`, {
    method: 'DELETE'
  })
  const { success } = await response.json()
  // This is not the best way to catch the parent item element.
  const itemElement = target.parentNode.parentNode

  if (success) {
    removeItemFromList(itemElement)
    updateOrder()
  }
}

const removeItemFromList = item => {
  item.querySelector('.edit').removeEventListener('click', editItemCallback)
  item.querySelector('.delete').removeEventListener('click', deleteItemCallback)
  item.remove()
  renderCount()
}

const renderCount = count => {
  itemCount.innerHTML = `${count} items`
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
