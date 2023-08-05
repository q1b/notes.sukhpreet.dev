export type Document = {
  label: string;
  summary: string;
  id: string;
  content: string;
}

export type Collection = {
  label: string;
  summary: string;
  id: string;
  created_at?: string;
  docs?: Document[]
  content: string;
}

export const useCollections = () => useState<Collection[]>('collections')

export const useCollection = () => useState<Omit<Collection, 'content' | 'label' | 'summary'> & { index: number; }>('collection')