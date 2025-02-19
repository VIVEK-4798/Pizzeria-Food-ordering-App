import {React, useState} from 'react';
import EditableImage from '@/components/layout/EditableImage';
import { faTrash} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const MenuItemForm = ({onSubmit, menuItem}) => {

    const [image, setImage] = useState(menuItem?.image || '');
    const [name, setName] = useState(menuItem?.name || '');
    const [description, setDescription] = useState(menuItem?.description || '');
    const [basePrice, setBasePrice] = useState(menuItem?.basePrice || '');
    const [sizes, setSizes] = useState([]);

    function addSize(){
        setSizes(oldSizes => {
            return [...oldSizes, {name:'', price:0}]
        });
        console.log("sizes",sizes);
    }
    function editSize(ev, index, prop){
        const newValue = ev.target.value;
        setSizes(prevSizes => {
            const newSizes = [...prevSizes];
            newSizes[index][prop] = newValue;
            return newSizes;
        })
    }
    function removeSize(indexToRemove) {
        setSizes(prev => prev.filter((v,index) => index !== indexToRemove));
    }

  return (
    <form
         onSubmit={ev => onSubmit(ev, {image, name, description, basePrice})} 
         className='mt-8 max-w-md mx-auto'>
            <div className="grid items-start gap-4"
                style={{gridTemplateColumns:'.3fr .7fr'}}>
                <div>
                   <EditableImage link={image} setLink={setImage}/>
                </div>
                <div className='grow'>
                    <label>Item name</label>
                    <input 
                       type='text'
                       value={name}
                       onChange={ev => setName(ev.target.value)}
                       />
                    <label>Description</label>
                    <input 
                       type='text'
                       value={description}
                       onChange={ev => setDescription(ev.target.value)}
                       />
                    <label>Base price</label>
                    <input 
                       type='text'
                       value={basePrice}
                       onChange={ev => setBasePrice(ev.target.value)}
                       />
                       <div className='bg-gray-200 p-2 rounded-md mb-2'>
                          <label>Sizes</label>
                          {sizes?.length > 0 && sizes.map((size, index) => (
                            <div key={index} className='flex items-end gap-2'>
                                <div>
                                    <label>Size name</label>
                                    <input type='text' placeholder='Size name' 
                                        value={size.name}
                                        onChange={ev => editSize(ev, index, 'name')}/>
                                </div>
                                <div>
                                    <label>Extra price</label>
                                    <input type='text' placeholder='Extra price' 
                                        value={size.price}
                                        onChange={ev => editSize(ev, index, 'price')}/>
                                </div>
                                <div>
                                    <button 
                                        type='button' 
                                        className='bg-white mb-3 px-2'
                                        onClick={() => removeSize(index)}    
                                    >
                                     <FontAwesomeIcon icon={faTrash} />   
                                    </button>
                                </div>
                            </div>
                          ))}
                          <button
                            type='button'
                            onClick={addSize} 
                            className='bg-white'>Add item size </button>
                       </div>
                    <button type='submit'>Save</button>
                </div>
            </div>
        </form>
  )
}

export default MenuItemForm