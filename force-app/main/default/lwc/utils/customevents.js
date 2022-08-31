const fireEvent = function(eventName, details, bubbles, composed){
    this.dispatchEvent(
        new CustomEvent(eventName, {
          bubbles: bubbles,
          composed: composed,
          detail: details
        })
      );
}

export {
    fireEvent
}