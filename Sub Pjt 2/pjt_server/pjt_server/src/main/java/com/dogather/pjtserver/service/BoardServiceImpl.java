package com.dogather.pjtserver.service;

import com.dogather.pjtserver.dao.BoardDao;
import com.dogather.pjtserver.dao.BoardMediaDao;
import com.dogather.pjtserver.dto.BoardDto;
import com.dogather.pjtserver.dto.BoardMediaDto;
import com.dogather.pjtserver.dto.BoardResponseDto;
import com.dogather.pjtserver.handler.FileHandler;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

@Service
@Slf4j
public class BoardServiceImpl implements BoardService {

    @Autowired
    public BoardDao boardDao;

    @Autowired
    public BoardMediaDao mediaDao;

    @Autowired
    public FileHandler fileHandler;

    @Override
    public int createBoard(BoardDto boardDto) {
        boardDto.setCreated(LocalDateTime.now());
        return boardDao.createBoard(boardDto);
    }

    @Override
    public int createBoard(BoardDto boardDto, List<MultipartFile> files) throws IOException {
        int queryResult = 1;

        if (createBoard(boardDto) == 0)
            return 0;
        List<BoardMediaDto> mediaList = fileHandler.uploadFiles(files, boardDto.getPostNo());
        if(CollectionUtils.isEmpty(mediaList) == false) {
            queryResult = mediaDao.insertMedia(mediaList);
            if (queryResult < 1) {
                queryResult = 0;
            }
        }
        return queryResult;
    }

    @Override
    public BoardResponseDto findBoard(int postNo) {
        BoardResponseDto boardResponseDto = boardDao.findBoard(postNo);

        return boardResponseDto;
    }

    @Override
    public int updateBoard(int postNo, BoardDto updateBoardDto, List<MultipartFile> addMediaList) throws IOException {
        int queryResult = 1;

        BoardResponseDto modifiedBoardDto = boardDao.findBoard(postNo);
        modifiedBoardDto.setBoardTitle(updateBoardDto.getBoardTitle());
        modifiedBoardDto.setBoardContent(updateBoardDto.getBoardContent());
        modifiedBoardDto.setUpdated(LocalDateTime.now());

        boardDao.updateBoard(modifiedBoardDto);
        List<BoardMediaDto> mediaList = fileHandler.uploadFiles(addMediaList, postNo);
        if(CollectionUtils.isEmpty(mediaList)== false) {
            queryResult = mediaDao.insertMedia(mediaList);
            if (queryResult < 1) {
                queryResult = 0;
            }
        }
        return queryResult;
    }

    @Override
    public int upView(int postNo) {
        log.info("=====1up");
        int result = boardDao.upView(postNo);
        log.info(String.valueOf(result));
        return result;
    }
}
