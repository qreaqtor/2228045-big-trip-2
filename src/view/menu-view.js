import { createElement } from "../render";

const menuTemplate = () => (`<nav class="trip-controls__trip-tabs  trip-tabs">
<a class="trip-tabs__btn  trip-tabs__btn--active" href="#">Table</a>
<a class="trip-tabs__btn" href="#">Stats</a>
</nav>`)

export default class MenuView
{
    getTemplate() 
    {
      return menuTemplate;
    }
    
    getElement() 
    {
      if (!this.element)
      {
        this.element = createElement(this.getTemplate());
      }
      return this.element;
    }
    
    removeElement() 
    {
      this.element = null;
    }
}