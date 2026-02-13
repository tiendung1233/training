import { Page, Button, Modal, TextField } from '@shopify/polaris';
import { useState, useCallback } from 'react';
import { Checkbox, Badge, ButtonGroup, InlineStack, Card } from '@shopify/polaris';

function TodoItem({ todo, checked, onCheckboxChange, handleDelete, handleComplete }) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <InlineStack gap="400" align="space-between" blockAlign="center" padding="400">
        <Checkbox
          label={todo.title}
          checked={checked}
          onChange={onCheckboxChange}
        />
        <InlineStack gap="400">
          <Badge tone={todo.status === 'Incomplete' ? 'attention' : 'success'}>{todo.status}</Badge>
          <ButtonGroup>
            <Button onClick={handleComplete} >Complete</Button>
            <Button destructive tone="critical" onClick={handleDelete}  >Delete</Button>
          </ButtonGroup>
        </InlineStack>
      </InlineStack>
    </div>
  );
}
function App() {
  const [checkedItems, setCheckedItems] = useState([]);
  const [modalActive, setModalActive] = useState(false);
  const [newTodoTitle, setNewTodoTitle] = useState('');

  const handleChange = useCallback(
    (id) => (value) => {
      if (value) {
        // Add id to checkedItems array
        setCheckedItems([...checkedItems, id]);
      } else {
        // Remove id from checkedItems array
        setCheckedItems(checkedItems.filter(itemId => itemId !== id));
      }
    },
    [checkedItems]
  );

  const [dataTodo, setDataTodo] = useState([
    { id: 1, title: 'Todo 1', status: 'Incomplete' },
    { id: 2, title: 'Todo 2', status: 'Incomplete' },
    { id: 3, title: 'Todo 3', status: 'Incomplete' },
  ]);

  const handleDelete = (id) => {
    setDataTodo(dataTodo.filter((todo) => todo.id !== id));
    console.log(id);
  };

  const handleCreate = () => {
    setModalActive(true);
  };

  const handleModalClose = () => {
    setModalActive(false);
    setNewTodoTitle('');
  };

  const handleSubmitNewTodo = () => {
    if (newTodoTitle.trim()) {
      const newId = dataTodo.length > 0 ? Math.max(...dataTodo.map(t => t.id)) + 1 : 1;
      setDataTodo([...dataTodo, {
        id: newId,
        title: newTodoTitle,
        status: 'Incomplete'
      }]);
      handleModalClose();
    }
  };

  const handleComplete = (id) => {
    setDataTodo(dataTodo.map((todo) => todo.id === id ? { ...todo, status: 'completed' } : todo));
  };

  const handleUnselectAll = () => {
    setCheckedItems([]);
  };

  const handleBulkComplete = () => {
    setDataTodo(dataTodo.map((todo) =>
      checkedItems.includes(todo.id) ? { ...todo, status: 'completed' } : todo
    ));
    setCheckedItems([]);
  };

  const handleBulkIncomplete = () => {
    setDataTodo(dataTodo.map((todo) =>
      checkedItems.includes(todo.id) ? { ...todo, status: 'Incomplete' } : todo
    ));
    setCheckedItems([]);
  };

  const handleBulkDelete = () => {
    setDataTodo(dataTodo.filter((todo) => !checkedItems.includes(todo.id)));
    setCheckedItems([]);
  };

  return (
    <Page title="Todo List App" secondaryActions={<Button variant="primary" onClick={handleCreate}>Create</Button>}>
      {checkedItems.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <Checkbox
            label={`${checkedItems.length} item${checkedItems.length > 1 ? 's' : ''} selected`}
            checked={true}
            onChange={handleUnselectAll}
          />
        </div>
      )}
      {dataTodo.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          checked={checkedItems.includes(todo.id)}
          onCheckboxChange={handleChange(todo.id)}
          handleDelete={() => handleDelete(todo.id)}
          handleComplete={() => handleComplete(todo.id)}
        />
      ))}
      {
        checkedItems.length > 0 && (
          <InlineStack gap="400" align="center" blockAlign="center" padding="400">
            <Card>
              <ButtonGroup>
                <InlineStack gap="400">
                  <Button variant="secondary" onClick={handleBulkComplete}>
                    Complete
                  </Button>
                  <Button variant="secondary" onClick={handleBulkIncomplete}>
                    Incomplete
                  </Button>
                  <Button variant="secondary" tone="critical" onClick={handleBulkDelete}>
                    Delete
                  </Button>
                </InlineStack>

              </ButtonGroup>
            </Card>
          </InlineStack>
        )
      }

      <Modal
        open={modalActive}
        onClose={handleModalClose}
        title="Create Todo"
        primaryAction={{
          content: 'Add',
          onAction: handleSubmitNewTodo,
        }}
        secondaryActions={[
          {
            content: 'Cancel',
            onAction: handleModalClose,
          },
        ]}
      >
        <Modal.Section>
          <TextField
            label="Todo Title"
            value={newTodoTitle}
            onChange={setNewTodoTitle}
            autoComplete="off"
            placeholder="Enter todo title"
          />
        </Modal.Section>
      </Modal>

    </Page>
  );
}

export default App;
