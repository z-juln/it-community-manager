import React from 'react'
import { Modal, Spin } from 'antd'

interface ModalWithLoadingProps extends React.ComponentProps<typeof Modal> {
  loading?: boolean
}

export default function ModalWithLoading(props: ModalWithLoadingProps) {
  const {children, loading} = props
  
  return (
    <Modal {...props}>
      { loading ? <Spin /> : children }
    </Modal>
  )
}
