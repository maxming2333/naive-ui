import type {
  ColumnKey,
  DataTableSetupProps,
  MainTableRef,
  TableColumn
} from './interface'
import { beforeNextFrameOnce } from 'seemly'
import { computed, type ComputedRef, type Ref, ref, watch } from 'vue'
import { useConfig, useRtl } from '../../_mixins'
import { formatLength } from '../../_utils'
import { getColKey, getNumberColWidth } from './utils'

export function useScroll(
  props: DataTableSetupProps,
  {
    mainTableInstRef,
    mergedCurrentPageRef,
    bodyWidthRef
  }: {
    bodyWidthRef: Ref<null | number>
    mainTableInstRef: Ref<MainTableRef | null>
    mergedCurrentPageRef: ComputedRef<number>
  }
) {
  let lastScrollLeft = 0
  const scrollPartRef = ref<'head' | 'body' | undefined>()
  const leftActiveFixedColKeyRef = ref<ColumnKey | null>(null)
  const leftActiveFixedChildrenColKeysRef = ref<ColumnKey[]>([])
  const rightActiveFixedColKeyRef = ref<ColumnKey | null>(null)
  const rightActiveFixedChildrenColKeysRef = ref<ColumnKey[]>([])
  const { mergedClsPrefixRef, mergedRtlRef } = useConfig(props)
  const rtlEnabledRef = useRtl('Scrollbar', mergedRtlRef, mergedClsPrefixRef)
  const styleScrollXRef = computed(() => {
    return formatLength(props.scrollX)
  })
  const leftFixedColumnsRef = computed(() => {
    return props.columns.filter(column => column.fixed === 'left')
  })
  const rightFixedColumnsRef = computed(() => {
    return props.columns.filter(column => column.fixed === 'right')
  })
  const fixedColumnLeftMapRef = computed(() => {
    const columns: Record<
      ColumnKey,
      { start: number, end: number } | undefined
    > = {}
    let left = 0
    function traverse(cols: TableColumn[]): void {
      cols.forEach((col) => {
        const positionInfo = { start: left, end: 0 }
        columns[getColKey(col)] = positionInfo
        if ('children' in col) {
          traverse(col.children)
          positionInfo.end = left
        }
        else {
          left += getNumberColWidth(col) || 0
          positionInfo.end = left
        }
      })
    }
    traverse(leftFixedColumnsRef.value)
    return columns
  })
  const fixedColumnRightMapRef = computed(() => {
    const columns: Record<
      ColumnKey,
      { start: number, end: number } | undefined
    > = {}
    let right = 0
    function traverse(cols: TableColumn[]): void {
      for (let i = cols.length - 1; i >= 0; --i) {
        const col = cols[i]
        const positionInfo = { start: right, end: 0 }
        columns[getColKey(col)] = positionInfo
        if ('children' in col) {
          traverse(col.children)
          positionInfo.end = right
        }
        else {
          right += getNumberColWidth(col) || 0
          positionInfo.end = right
        }
      }
    }
    traverse(rightFixedColumnsRef.value)
    return columns
  })
  function deriveActiveLeftFixedColumn(): void {
    // target is header element
    const { value: leftFixedColumns } = leftFixedColumnsRef
    let leftWidth = 0
    const { value: fixedColumnLeftMap } = fixedColumnLeftMapRef
    let leftActiveFixedColKey: string | number | null = null
    if (rtlEnabledRef?.value) {
      const { value: tableWidth } = bodyWidthRef
      if (tableWidth === null)
        return
      const scrollWidth = Number(props.scrollX) || tableWidth
      const effectiveScrollLeft = scrollWidth - tableWidth + lastScrollLeft
      for (let i = 0; i < leftFixedColumns.length; ++i) {
        const key = getColKey(leftFixedColumns[i])
        if (
          effectiveScrollLeft
          > (fixedColumnLeftMap[key]?.start || 0) - leftWidth
        ) {
          leftActiveFixedColKey = key
          leftWidth = fixedColumnLeftMap[key]?.end || 0
        }
        else {
          break
        }
      }
    }
    else {
      for (let i = 0; i < leftFixedColumns.length; ++i) {
        const key = getColKey(leftFixedColumns[i])
        if (
          lastScrollLeft
          > (fixedColumnLeftMap[key]?.start || 0) - leftWidth
        ) {
          leftActiveFixedColKey = key
          leftWidth = fixedColumnLeftMap[key]?.end || 0
        }
        else {
          break
        }
      }
    }
    leftActiveFixedColKeyRef.value = leftActiveFixedColKey
  }
  function deriveActiveLeftFixedChildrenColumns(): void {
    leftActiveFixedChildrenColKeysRef.value = []
    let activeLeftFixedColumn = props.columns.find(
      col => getColKey(col) === leftActiveFixedColKeyRef.value
    )
    while (activeLeftFixedColumn && 'children' in activeLeftFixedColumn) {
      const length: number = activeLeftFixedColumn.children.length
      if (length === 0)
        break
      const nextActiveLeftFixedColumn
        = activeLeftFixedColumn.children[length - 1]
      leftActiveFixedChildrenColKeysRef.value.push(
        getColKey(nextActiveLeftFixedColumn)
      )
      activeLeftFixedColumn = nextActiveLeftFixedColumn
    }
  }
  function deriveActiveRightFixedColumn(): void {
    // target is header element
    const { value: rightFixedColumns } = rightFixedColumnsRef
    const scrollWidth = Number(props.scrollX)
    const { value: tableWidth } = bodyWidthRef
    if (tableWidth === null)
      return
    let rightWidth = 0
    let rightActiveFixedColKey: string | number | null = null
    const { value: fixedColumnRightMap } = fixedColumnRightMapRef
    if (rtlEnabledRef?.value) {
      for (let i = rightFixedColumns.length - 1; i >= 0; --i) {
        const key = getColKey(rightFixedColumns[i])
        const effectiveScrollLeft = Math.abs(lastScrollLeft)
        if (
          effectiveScrollLeft + tableWidth
          > scrollWidth - (fixedColumnRightMap[key]?.start || 0)
        ) {
          rightActiveFixedColKey = key
          rightWidth = fixedColumnRightMap[key]?.end || 0
        }
        else {
          break
        }
      }
    }
    else {
      for (let i = rightFixedColumns.length - 1; i >= 0; --i) {
        const key = getColKey(rightFixedColumns[i])
        if (
          Math.round(
            lastScrollLeft
            + (fixedColumnRightMap[key]?.start || 0)
            + tableWidth
            - rightWidth
          ) < scrollWidth
        ) {
          rightActiveFixedColKey = key
          rightWidth = fixedColumnRightMap[key]?.end || 0
        }
        else {
          break
        }
      }
    }
    rightActiveFixedColKeyRef.value = rightActiveFixedColKey
  }
  function deriveActiveRightFixedChildrenColumns(): void {
    rightActiveFixedChildrenColKeysRef.value = []
    let activeRightFixedColumn = props.columns.find(
      col => getColKey(col) === rightActiveFixedColKeyRef.value
    )
    while (
      activeRightFixedColumn
      && 'children' in activeRightFixedColumn
      && activeRightFixedColumn.children.length
    ) {
      const nextActiveRightFixedColumn = activeRightFixedColumn.children[0]
      rightActiveFixedChildrenColKeysRef.value.push(
        getColKey(nextActiveRightFixedColumn)
      )
      activeRightFixedColumn = nextActiveRightFixedColumn
    }
  }

  function getScrollElements(): {
    header: HTMLElement | null
    body: HTMLElement | null
  } {
    const header = mainTableInstRef.value
      ? mainTableInstRef.value.getHeaderElement()
      : null
    const body = mainTableInstRef.value
      ? mainTableInstRef.value.getBodyElement()
      : null
    return {
      header,
      body
    }
  }
  function scrollMainTableBodyToTop(): void {
    const { body } = getScrollElements()
    if (body) {
      body.scrollTop = 0
    }
  }
  function handleTableHeaderScroll(): void {
    if (scrollPartRef.value !== 'body') {
      beforeNextFrameOnce(syncScrollState)
    }
    else {
      scrollPartRef.value = undefined
    }
  }
  function handleTableBodyScroll(e: Event): void {
    props.onScroll?.(e)
    if (scrollPartRef.value !== 'head') {
      beforeNextFrameOnce(syncScrollState)
    }
    else {
      scrollPartRef.value = undefined
    }
  }
  function syncScrollState(): void {
    // We can't simply use props.scrollX to determine whether the table has
    // need to be sync since user may set column width for each column.
    // Just let it be, the scroll listener won't be triggered for a basic table.
    const { header, body } = getScrollElements()
    if (!body)
      return
    const { value: tableWidth } = bodyWidthRef
    if (tableWidth === null)
      return
    if (props.maxHeight || props.flexHeight) {
      if (!header)
        return
      // we need to deal with overscroll
      const directionHead = lastScrollLeft - header.scrollLeft
      scrollPartRef.value = directionHead !== 0 ? 'head' : 'body'
      if (scrollPartRef.value === 'head') {
        lastScrollLeft = header.scrollLeft
        body.scrollLeft = lastScrollLeft
      }
      else {
        lastScrollLeft = body.scrollLeft
        header.scrollLeft = lastScrollLeft
      }
    }
    else {
      lastScrollLeft = body.scrollLeft
    }
    deriveActiveLeftFixedColumn()
    deriveActiveLeftFixedChildrenColumns()
    deriveActiveRightFixedColumn()
    deriveActiveRightFixedChildrenColumns()
  }
  function setHeaderScrollLeft(left: number): void {
    const { header } = getScrollElements()
    if (!header)
      return
    header.scrollLeft = left * (rtlEnabledRef?.value ? -1 : 1)
    syncScrollState()
  }
  watch(mergedCurrentPageRef, () => {
    scrollMainTableBodyToTop()
  })
  return {
    styleScrollXRef,
    fixedColumnLeftMapRef,
    fixedColumnRightMapRef,
    leftFixedColumnsRef,
    rightFixedColumnsRef,
    leftActiveFixedColKeyRef,
    leftActiveFixedChildrenColKeysRef,
    rightActiveFixedColKeyRef,
    rightActiveFixedChildrenColKeysRef,
    syncScrollState,
    handleTableBodyScroll,
    handleTableHeaderScroll,
    setHeaderScrollLeft
  }
}
