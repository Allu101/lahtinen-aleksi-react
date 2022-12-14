export const contains = (list, value) => {
  let found = false;
  console.log(list);
  list.map((id) => {
    if (Number(id) === Number(value)) {
      found = true;
    }
  });
  return found;
};

export const getContextButtons = (
  allContexts,
  selectedContexts,
  handleClick
) => {
  let buttons = [];
  let className = '';
  allContexts.map((context, index) => {
    if (contains(selectedContexts, context.id)) {
      className = 'context';
    } else {
      className = 'context unselected-context';
    }
    buttons.push(
      <button
        key={index}
        className={className}
        onClick={() => {
          handleClick(context.id);
        }}
      >
        {context.name}
      </button>
    );
  });
  return buttons;
};
