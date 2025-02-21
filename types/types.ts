export interface Figure {
  id: string;
  name: string;
  price: string;
  image: any | null;
}

export interface FigureFormProps {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  name: string;
  setName: (name: string) => void;
  price: string;
  setPrice: (price: string) => void;
  image: string | null;
  setImage: (image: string | null) => void;
  handleSubmit: () => void;
}

export interface FigureCardProps {
  item: Figure;
  onDelete: (id: string) => void;
}

export interface FigureListProps {
  figures: Figure[];
  handleDelete: (id: string) => void;
}
